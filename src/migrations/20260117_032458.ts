import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_role" AS ENUM('superadmin', 'admintoko', 'kasir');
  CREATE TYPE "public"."enum_promos_available_days" AS ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');
  CREATE TYPE "public"."enum_promos_order_type" AS ENUM('dinein', 'takeaway', 'delivery');
  CREATE TYPE "public"."enum_promos_kategori" AS ENUM('all', 'product', 'min_purchase');
  CREATE TYPE "public"."enum_promos_promo_type" AS ENUM('discount', 'bxgy');
  CREATE TYPE "public"."enum_promos_tipe_diskon" AS ENUM('percent', 'nominal');
  CREATE TYPE "public"."enum_promos_stacking" AS ENUM('no', 'yes', 'single');
  CREATE TYPE "public"."enum_promos_limit_customer" AS ENUM('unlimited', 'one', 'multiple');
  CREATE TYPE "public"."enum_promos_status" AS ENUM('Aktif', 'Nonaktif');
  CREATE TYPE "public"."enum_products_status" AS ENUM('aktif', 'nonaktif');
  CREATE TYPE "public"."enum_transactions_status" AS ENUM('proses', 'selesai', 'batal');
  CREATE TYPE "public"."enum_transactions_cara_bayar" AS ENUM('cash', 'non_cash');
  CREATE TYPE "public"."enum_payments_status" AS ENUM('pending', 'paid', 'expired', 'failed');
  CREATE TYPE "public"."enum_notifications_type" AS ENUM('transaksi', 'produk', 'promo', 'reservasi', 'peringatan');
  CREATE TYPE "public"."enum_notifications_icon" AS ENUM('berhasil', 'gagal', 'warning', 'baru');
  CREATE TYPE "public"."enum_notifications_tipe" AS ENUM('low_stock', 'out_of_stock', 'promo_low_quota', 'promo_out_quota', 'trx_success', 'trx_cancel', 'reservation_new', 'reservation_confirm', 'reservation_cancel', 'product_new');
  CREATE TYPE "public"."enum_reservations_jenis_kelamin" AS ENUM('laki-laki', 'perempuan');
  CREATE TYPE "public"."enum_reservations_status_pembayaran" AS ENUM('unpaid', 'partial', 'paid');
  CREATE TYPE "public"."enum_reservations_metode_pembayaran" AS ENUM('tunai', 'ewallet', 'qris', 'va');
  CREATE TYPE "public"."enum_reservations_status" AS ENUM('menunggu', 'dikonfirmasi', 'checkin', 'selesai', 'noshow');
  CREATE TYPE "public"."enum_tables_lantai" AS ENUM('lantai_1', 'lantai_2', 'lantai_3', 'rooftop');
  CREATE TYPE "public"."enum_tables_area" AS ENUM('vip', 'indoor', 'outdoor', 'smoking');
  CREATE TYPE "public"."enum_tables_bentuk" AS ENUM('kotak', 'bulat');
  CREATE TYPE "public"."enum_payment_methods_type" AS ENUM('cash', 'bank_transfer', 'qris', 'ewallet');
  CREATE TYPE "public"."enum_shifts_shift_name" AS ENUM('Pagi', 'Siang', 'Malam');
  CREATE TYPE "public"."enum_shifts_status" AS ENUM('open', 'closed');
  CREATE TABLE "tenants" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"domain" varchar,
  	"created_by_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"role" "enum_users_role" DEFAULT 'kasir',
  	"tenant_id" integer,
  	"email_verified" boolean DEFAULT false,
  	"otp" varchar,
  	"otp_expiration" timestamp(3) with time zone,
  	"phone" varchar,
  	"business_name" varchar,
  	"temp_business_name" varchar,
  	"admin_name" varchar,
  	"business_field" varchar,
  	"business_type" varchar,
  	"address" varchar,
  	"is_business_user" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"prefix" varchar DEFAULT 'media',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "promos_available_days" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_promos_available_days",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "promos_order_type" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_promos_order_type",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "promos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"nama" varchar NOT NULL,
  	"kode" varchar NOT NULL,
  	"show_on_dashboard" boolean DEFAULT true,
  	"banner_id" integer,
  	"mulai" timestamp(3) with time zone NOT NULL,
  	"akhir" timestamp(3) with time zone NOT NULL,
  	"start_time" varchar,
  	"end_time" varchar,
  	"kategori" "enum_promos_kategori" DEFAULT 'all' NOT NULL,
  	"produk_id" integer,
  	"min_pembelian" numeric,
  	"promo_type" "enum_promos_promo_type" DEFAULT 'discount' NOT NULL,
  	"tipe_diskon" "enum_promos_tipe_diskon" DEFAULT 'percent',
  	"nilai_diskon" numeric,
  	"buy_quantity" numeric,
  	"free_quantity" numeric,
  	"is_multiple" boolean DEFAULT true,
  	"use_quota" boolean DEFAULT false,
  	"kuota" numeric,
  	"kuota_used" numeric DEFAULT 0,
  	"stacking" "enum_promos_stacking" DEFAULT 'no',
  	"limit_customer" "enum_promos_limit_customer" DEFAULT 'unlimited',
  	"status" "enum_promos_status" DEFAULT 'Aktif',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "promos_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"products_id" integer
  );
  
  CREATE TABLE "products" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"nama" varchar NOT NULL,
  	"use_auto_sku" boolean DEFAULT true,
  	"sku" varchar,
  	"kategori_id" integer NOT NULL,
  	"harga" numeric NOT NULL,
  	"stok" numeric DEFAULT 0 NOT NULL,
  	"gambar_id" integer,
  	"deskripsi" varchar,
  	"status" "enum_products_status" DEFAULT 'aktif' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "transactions_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"nama" varchar NOT NULL,
  	"harga" numeric NOT NULL,
  	"qty" numeric NOT NULL
  );
  
  CREATE TABLE "transactions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"no_pesanan" varchar,
  	"tenant_id" integer NOT NULL,
  	"nama_kasir" varchar NOT NULL,
  	"nama_pelanggan" varchar,
  	"subtotal" numeric NOT NULL,
  	"pajak" numeric NOT NULL,
  	"discount" numeric DEFAULT 0,
  	"total" numeric NOT NULL,
  	"status" "enum_transactions_status" DEFAULT 'proses',
  	"cara_bayar" "enum_transactions_cara_bayar" DEFAULT 'cash' NOT NULL,
  	"payment_method_id" integer,
  	"bayar" numeric,
  	"kembalian" numeric,
  	"waktu" timestamp(3) with time zone NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payments" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order_id" varchar NOT NULL,
  	"method_id" integer,
  	"amount" numeric NOT NULL,
  	"status" "enum_payments_status" DEFAULT 'pending',
  	"reference" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "notifications" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum_notifications_type" NOT NULL,
  	"icon" "enum_notifications_icon" NOT NULL,
  	"tipe" "enum_notifications_tipe" NOT NULL,
  	"title" varchar NOT NULL,
  	"message" varchar NOT NULL,
  	"is_read" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "reservations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"kode_reservasi" varchar,
  	"waktu_reservasi" timestamp(3) with time zone,
  	"nama_pelanggan" varchar NOT NULL,
  	"jenis_kelamin" "enum_reservations_jenis_kelamin" NOT NULL,
  	"no_telepon" varchar NOT NULL,
  	"email" varchar,
  	"tanggal" timestamp(3) with time zone NOT NULL,
  	"jam_mulai" varchar NOT NULL,
  	"jam_selesai" varchar NOT NULL,
  	"durasi_menit" numeric,
  	"pax" numeric NOT NULL,
  	"deposit" numeric DEFAULT 0,
  	"total_tagihan" numeric,
  	"status_pembayaran" "enum_reservations_status_pembayaran" DEFAULT 'unpaid',
  	"metode_pembayaran" "enum_reservations_metode_pembayaran",
  	"meja_id" integer NOT NULL,
  	"status" "enum_reservations_status" DEFAULT 'menunggu',
  	"kasir_id" integer,
  	"check_in_at" timestamp(3) with time zone,
  	"check_out_at" timestamp(3) with time zone,
  	"catatan" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nama" varchar NOT NULL,
  	"ikon_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "store_settings_jam_buka" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hari" varchar,
  	"buka" boolean,
  	"full_day" boolean,
  	"jam_buka" varchar,
  	"jam_tutup" varchar
  );
  
  CREATE TABLE "store_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer NOT NULL,
  	"store_name" varchar NOT NULL,
  	"service_charge" boolean DEFAULT true,
  	"service_charge_percentage" numeric DEFAULT 10,
  	"pajak" boolean DEFAULT true,
  	"pajak_percentage" numeric DEFAULT 10,
  	"struk_header" varchar,
  	"struk_footer" varchar,
  	"struk_logo_id" integer,
  	"struk_paper_size" numeric DEFAULT 80,
  	"struk_options_info_toko" boolean,
  	"struk_options_no_nota" boolean,
  	"struk_options_no_transaksi" boolean,
  	"struk_options_jam_transaksi" boolean,
  	"struk_options_jam_buka" boolean,
  	"struk_options_info_tambahan" boolean,
  	"struk_options_nama_meja" boolean,
  	"struk_options_mode_penjualan" boolean,
  	"struk_options_pax" boolean,
  	"struk_options_nama_kasir" boolean,
  	"struk_options_posmind_order" boolean,
  	"struk_options_cetak_ke" boolean,
  	"struk_options_promo_menu" boolean,
  	"struk_options_pembulatan" boolean,
  	"struk_options_pajak" boolean,
  	"struk_options_service" boolean,
  	"struk_options_wifi" boolean,
  	"struk_options_powered" boolean,
  	"dapur_paper_size" numeric DEFAULT 80,
  	"dapur_options_no_transaksi" boolean,
  	"dapur_options_tanggal_transaksi" boolean,
  	"dapur_options_jam_transaksi" boolean,
  	"dapur_options_mode_penjualan" boolean,
  	"dapur_options_nama_waiter" boolean,
  	"dapur_options_nama_waiter2" boolean,
  	"dapur_options_nama_sender" boolean,
  	"dapur_options_info_tambahan" boolean,
  	"dapur_options_nama_meja" boolean,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "tables" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nama_meja" varchar NOT NULL,
  	"kapasitas" numeric NOT NULL,
  	"lantai" "enum_tables_lantai" NOT NULL,
  	"area" "enum_tables_area",
  	"bentuk" "enum_tables_bentuk" DEFAULT 'kotak',
  	"posisi_x" numeric NOT NULL,
  	"posisi_y" numeric NOT NULL,
  	"dp_meja" numeric DEFAULT 0,
  	"catatan" varchar,
  	"tenant_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payment_methods" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"type" "enum_payment_methods_type" NOT NULL,
  	"external_id" numeric,
  	"code" varchar,
  	"is_active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "shifts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"shift_code" varchar,
  	"shift_name" "enum_shifts_shift_name" NOT NULL,
  	"status" "enum_shifts_status" DEFAULT 'open',
  	"cashier_id" integer,
  	"cashier_email" varchar,
  	"opened_at" timestamp(3) with time zone,
  	"closed_at" timestamp(3) with time zone,
  	"opening_cash" numeric NOT NULL,
  	"expected_cash" numeric DEFAULT 0,
  	"expected_non_cash" numeric DEFAULT 0,
  	"actual_cash" numeric DEFAULT 0,
  	"actual_non_cash" numeric DEFAULT 0,
  	"difference_cash" numeric,
  	"difference_non_cash" numeric,
  	"closing_note" varchar,
  	"is_cash_matched" boolean,
  	"is_non_cash_matched" boolean,
  	"closing_action" boolean,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tenants_id" integer,
  	"users_id" integer,
  	"media_id" integer,
  	"promos_id" integer,
  	"products_id" integer,
  	"transactions_id" integer,
  	"payments_id" integer,
  	"notifications_id" integer,
  	"reservations_id" integer,
  	"categories_id" integer,
  	"store_settings_id" integer,
  	"tables_id" integer,
  	"payment_methods_id" integer,
  	"shifts_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "tenants" ADD CONSTRAINT "tenants_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users" ADD CONSTRAINT "users_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "promos_available_days" ADD CONSTRAINT "promos_available_days_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."promos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "promos_order_type" ADD CONSTRAINT "promos_order_type_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."promos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "promos" ADD CONSTRAINT "promos_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "promos" ADD CONSTRAINT "promos_banner_id_media_id_fk" FOREIGN KEY ("banner_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "promos" ADD CONSTRAINT "promos_produk_id_products_id_fk" FOREIGN KEY ("produk_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "promos_rels" ADD CONSTRAINT "promos_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."promos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "promos_rels" ADD CONSTRAINT "promos_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_kategori_id_categories_id_fk" FOREIGN KEY ("kategori_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_gambar_id_media_id_fk" FOREIGN KEY ("gambar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "transactions_items" ADD CONSTRAINT "transactions_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."transactions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "transactions" ADD CONSTRAINT "transactions_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "transactions" ADD CONSTRAINT "transactions_payment_method_id_payment_methods_id_fk" FOREIGN KEY ("payment_method_id") REFERENCES "public"."payment_methods"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payments" ADD CONSTRAINT "payments_method_id_payment_methods_id_fk" FOREIGN KEY ("method_id") REFERENCES "public"."payment_methods"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "reservations" ADD CONSTRAINT "reservations_meja_id_tables_id_fk" FOREIGN KEY ("meja_id") REFERENCES "public"."tables"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "reservations" ADD CONSTRAINT "reservations_kasir_id_users_id_fk" FOREIGN KEY ("kasir_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories" ADD CONSTRAINT "categories_ikon_id_media_id_fk" FOREIGN KEY ("ikon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "store_settings_jam_buka" ADD CONSTRAINT "store_settings_jam_buka_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."store_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "store_settings" ADD CONSTRAINT "store_settings_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "store_settings" ADD CONSTRAINT "store_settings_struk_logo_id_media_id_fk" FOREIGN KEY ("struk_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tables" ADD CONSTRAINT "tables_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "shifts" ADD CONSTRAINT "shifts_cashier_id_users_id_fk" FOREIGN KEY ("cashier_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tenants_fk" FOREIGN KEY ("tenants_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_promos_fk" FOREIGN KEY ("promos_id") REFERENCES "public"."promos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_transactions_fk" FOREIGN KEY ("transactions_id") REFERENCES "public"."transactions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payments_fk" FOREIGN KEY ("payments_id") REFERENCES "public"."payments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_notifications_fk" FOREIGN KEY ("notifications_id") REFERENCES "public"."notifications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_reservations_fk" FOREIGN KEY ("reservations_id") REFERENCES "public"."reservations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_store_settings_fk" FOREIGN KEY ("store_settings_id") REFERENCES "public"."store_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tables_fk" FOREIGN KEY ("tables_id") REFERENCES "public"."tables"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payment_methods_fk" FOREIGN KEY ("payment_methods_id") REFERENCES "public"."payment_methods"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_shifts_fk" FOREIGN KEY ("shifts_id") REFERENCES "public"."shifts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "tenants_created_by_idx" ON "tenants" USING btree ("created_by_id");
  CREATE INDEX "tenants_updated_at_idx" ON "tenants" USING btree ("updated_at");
  CREATE INDEX "tenants_created_at_idx" ON "tenants" USING btree ("created_at");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_tenant_idx" ON "users" USING btree ("tenant_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "promos_available_days_order_idx" ON "promos_available_days" USING btree ("order");
  CREATE INDEX "promos_available_days_parent_idx" ON "promos_available_days" USING btree ("parent_id");
  CREATE INDEX "promos_order_type_order_idx" ON "promos_order_type" USING btree ("order");
  CREATE INDEX "promos_order_type_parent_idx" ON "promos_order_type" USING btree ("parent_id");
  CREATE INDEX "promos_tenant_idx" ON "promos" USING btree ("tenant_id");
  CREATE INDEX "promos_banner_idx" ON "promos" USING btree ("banner_id");
  CREATE INDEX "promos_produk_idx" ON "promos" USING btree ("produk_id");
  CREATE INDEX "promos_updated_at_idx" ON "promos" USING btree ("updated_at");
  CREATE INDEX "promos_created_at_idx" ON "promos" USING btree ("created_at");
  CREATE INDEX "promos_rels_order_idx" ON "promos_rels" USING btree ("order");
  CREATE INDEX "promos_rels_parent_idx" ON "promos_rels" USING btree ("parent_id");
  CREATE INDEX "promos_rels_path_idx" ON "promos_rels" USING btree ("path");
  CREATE INDEX "promos_rels_products_id_idx" ON "promos_rels" USING btree ("products_id");
  CREATE INDEX "products_tenant_idx" ON "products" USING btree ("tenant_id");
  CREATE INDEX "products_kategori_idx" ON "products" USING btree ("kategori_id");
  CREATE INDEX "products_gambar_idx" ON "products" USING btree ("gambar_id");
  CREATE INDEX "products_updated_at_idx" ON "products" USING btree ("updated_at");
  CREATE INDEX "products_created_at_idx" ON "products" USING btree ("created_at");
  CREATE INDEX "transactions_items_order_idx" ON "transactions_items" USING btree ("_order");
  CREATE INDEX "transactions_items_parent_id_idx" ON "transactions_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "transactions_no_pesanan_idx" ON "transactions" USING btree ("no_pesanan");
  CREATE INDEX "transactions_tenant_idx" ON "transactions" USING btree ("tenant_id");
  CREATE INDEX "transactions_payment_method_idx" ON "transactions" USING btree ("payment_method_id");
  CREATE INDEX "transactions_updated_at_idx" ON "transactions" USING btree ("updated_at");
  CREATE INDEX "transactions_created_at_idx" ON "transactions" USING btree ("created_at");
  CREATE INDEX "payments_method_idx" ON "payments" USING btree ("method_id");
  CREATE INDEX "payments_updated_at_idx" ON "payments" USING btree ("updated_at");
  CREATE INDEX "payments_created_at_idx" ON "payments" USING btree ("created_at");
  CREATE INDEX "notifications_updated_at_idx" ON "notifications" USING btree ("updated_at");
  CREATE INDEX "notifications_created_at_idx" ON "notifications" USING btree ("created_at");
  CREATE UNIQUE INDEX "reservations_kode_reservasi_idx" ON "reservations" USING btree ("kode_reservasi");
  CREATE INDEX "reservations_meja_idx" ON "reservations" USING btree ("meja_id");
  CREATE INDEX "reservations_kasir_idx" ON "reservations" USING btree ("kasir_id");
  CREATE INDEX "reservations_updated_at_idx" ON "reservations" USING btree ("updated_at");
  CREATE INDEX "reservations_created_at_idx" ON "reservations" USING btree ("created_at");
  CREATE INDEX "categories_ikon_idx" ON "categories" USING btree ("ikon_id");
  CREATE INDEX "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
  CREATE INDEX "categories_created_at_idx" ON "categories" USING btree ("created_at");
  CREATE INDEX "store_settings_jam_buka_order_idx" ON "store_settings_jam_buka" USING btree ("_order");
  CREATE INDEX "store_settings_jam_buka_parent_id_idx" ON "store_settings_jam_buka" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "store_settings_tenant_idx" ON "store_settings" USING btree ("tenant_id");
  CREATE INDEX "store_settings_struk_struk_logo_idx" ON "store_settings" USING btree ("struk_logo_id");
  CREATE INDEX "store_settings_updated_at_idx" ON "store_settings" USING btree ("updated_at");
  CREATE INDEX "store_settings_created_at_idx" ON "store_settings" USING btree ("created_at");
  CREATE INDEX "tables_nama_meja_idx" ON "tables" USING btree ("nama_meja");
  CREATE INDEX "tables_tenant_idx" ON "tables" USING btree ("tenant_id");
  CREATE INDEX "tables_updated_at_idx" ON "tables" USING btree ("updated_at");
  CREATE INDEX "tables_created_at_idx" ON "tables" USING btree ("created_at");
  CREATE INDEX "payment_methods_updated_at_idx" ON "payment_methods" USING btree ("updated_at");
  CREATE INDEX "payment_methods_created_at_idx" ON "payment_methods" USING btree ("created_at");
  CREATE UNIQUE INDEX "shifts_shift_code_idx" ON "shifts" USING btree ("shift_code");
  CREATE INDEX "shifts_cashier_idx" ON "shifts" USING btree ("cashier_id");
  CREATE INDEX "shifts_updated_at_idx" ON "shifts" USING btree ("updated_at");
  CREATE INDEX "shifts_created_at_idx" ON "shifts" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_tenants_id_idx" ON "payload_locked_documents_rels" USING btree ("tenants_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_promos_id_idx" ON "payload_locked_documents_rels" USING btree ("promos_id");
  CREATE INDEX "payload_locked_documents_rels_products_id_idx" ON "payload_locked_documents_rels" USING btree ("products_id");
  CREATE INDEX "payload_locked_documents_rels_transactions_id_idx" ON "payload_locked_documents_rels" USING btree ("transactions_id");
  CREATE INDEX "payload_locked_documents_rels_payments_id_idx" ON "payload_locked_documents_rels" USING btree ("payments_id");
  CREATE INDEX "payload_locked_documents_rels_notifications_id_idx" ON "payload_locked_documents_rels" USING btree ("notifications_id");
  CREATE INDEX "payload_locked_documents_rels_reservations_id_idx" ON "payload_locked_documents_rels" USING btree ("reservations_id");
  CREATE INDEX "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id");
  CREATE INDEX "payload_locked_documents_rels_store_settings_id_idx" ON "payload_locked_documents_rels" USING btree ("store_settings_id");
  CREATE INDEX "payload_locked_documents_rels_tables_id_idx" ON "payload_locked_documents_rels" USING btree ("tables_id");
  CREATE INDEX "payload_locked_documents_rels_payment_methods_id_idx" ON "payload_locked_documents_rels" USING btree ("payment_methods_id");
  CREATE INDEX "payload_locked_documents_rels_shifts_id_idx" ON "payload_locked_documents_rels" USING btree ("shifts_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "tenants" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "promos_available_days" CASCADE;
  DROP TABLE "promos_order_type" CASCADE;
  DROP TABLE "promos" CASCADE;
  DROP TABLE "promos_rels" CASCADE;
  DROP TABLE "products" CASCADE;
  DROP TABLE "transactions_items" CASCADE;
  DROP TABLE "transactions" CASCADE;
  DROP TABLE "payments" CASCADE;
  DROP TABLE "notifications" CASCADE;
  DROP TABLE "reservations" CASCADE;
  DROP TABLE "categories" CASCADE;
  DROP TABLE "store_settings_jam_buka" CASCADE;
  DROP TABLE "store_settings" CASCADE;
  DROP TABLE "tables" CASCADE;
  DROP TABLE "payment_methods" CASCADE;
  DROP TABLE "shifts" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_promos_available_days";
  DROP TYPE "public"."enum_promos_order_type";
  DROP TYPE "public"."enum_promos_kategori";
  DROP TYPE "public"."enum_promos_promo_type";
  DROP TYPE "public"."enum_promos_tipe_diskon";
  DROP TYPE "public"."enum_promos_stacking";
  DROP TYPE "public"."enum_promos_limit_customer";
  DROP TYPE "public"."enum_promos_status";
  DROP TYPE "public"."enum_products_status";
  DROP TYPE "public"."enum_transactions_status";
  DROP TYPE "public"."enum_transactions_cara_bayar";
  DROP TYPE "public"."enum_payments_status";
  DROP TYPE "public"."enum_notifications_type";
  DROP TYPE "public"."enum_notifications_icon";
  DROP TYPE "public"."enum_notifications_tipe";
  DROP TYPE "public"."enum_reservations_jenis_kelamin";
  DROP TYPE "public"."enum_reservations_status_pembayaran";
  DROP TYPE "public"."enum_reservations_metode_pembayaran";
  DROP TYPE "public"."enum_reservations_status";
  DROP TYPE "public"."enum_tables_lantai";
  DROP TYPE "public"."enum_tables_area";
  DROP TYPE "public"."enum_tables_bentuk";
  DROP TYPE "public"."enum_payment_methods_type";
  DROP TYPE "public"."enum_shifts_shift_name";
  DROP TYPE "public"."enum_shifts_status";`)
}
