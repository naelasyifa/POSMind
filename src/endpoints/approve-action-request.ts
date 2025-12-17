import type { Endpoint } from 'payload'

export const approveActionRequest: Endpoint = {
  path: '/action-requests/:id/approve',
  method: 'post',

  handler: async (req) => {
    const { payload, user } = req

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (user.role !== 'admintoko' && user.role !== 'superadmin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    // ✅ Payload v3 way
    const id = req.url.split('/').pop()
    if (!id) {
      return Response.json({ error: 'Missing request ID' }, { status: 400 })
    }

    const actionRequest = await payload.findByID({
      collection: 'action-requests',
      id,
    })

    if (!actionRequest) {
      return Response.json({ error: 'Not found' }, { status: 404 })
    }

    // Tenant isolation
    if (
      user.role !== 'superadmin' &&
      String(actionRequest.tenant) !== String(user.tenant)
    ) {
      return Response.json({ error: 'Cross-tenant access denied' }, { status: 403 })
    }

    if (actionRequest.status !== 'pending') {
      return Response.json({ error: 'Already processed' }, { status: 409 })
    }

    const action = actionRequest.actionType
    const data = actionRequest.payload as Record<string, any>

    const productId =
      typeof actionRequest.product === 'object'
        ? actionRequest.product?.id
        : actionRequest.product

    // === EXECUTE ===
    if (action === 'create') {
      await payload.create({
        collection: 'products',
        data,
        overrideAccess: true,
      })
    }

    if (action === 'update') {
      if (!productId) {
        return Response.json({ error: 'Missing product ID' }, { status: 400 })
      }

      await payload.update({
        collection: 'products',
        id: productId,
        data,
        overrideAccess: true,
      })
    }

    if (action === 'delete') {
      if (!productId) {
        return Response.json({ error: 'Missing product ID' }, { status: 400 })
      }

      await payload.delete({
        collection: 'products',
        id: productId,
        overrideAccess: true,
      })
    }

    // === MARK APPROVED ===
    await payload.update({
      collection: 'action-requests',
      id,
      data: {
        status: 'approved',
        approvedBy: user.id,
      },
      overrideAccess: true,
    })

    return Response.json({ success: true })
  },
}
