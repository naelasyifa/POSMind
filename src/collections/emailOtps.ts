import { CollectionConfig } from 'payload';

const EmailOtps: CollectionConfig = {
  slug: 'emailOtps',
  admin: { useAsTitle: 'email' },
  access: { read: () => false },
  fields: [
    { name: 'email', type: 'text', required: true },
    { name: 'otp', type: 'text', required: true },
    { name: 'expiresAt', type: 'date', required: true },
  ],
};

export default EmailOtps;
