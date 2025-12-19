import type { Endpoint } from 'payload'

export const approveActionRequest: Endpoint = {
  path: '/action-requests/:id/approve',
  method: 'post',

  handler: async (req) => {
    const { payload, user, routeParams } = req
    const id = routeParams?.id as string
    if (!id) return Response.json({ error: 'Missing request ID' }, { status: 400 })

    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })
    if (user.role !== 'admintoko' && user.role !== 'superadmin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    const actionRequest = await payload.findByID({
      collection: 'action-requests',
      id,
    })

    if (actionRequest.tenant !== user.tenant && user.role !== 'superadmin') {
  return Response.json({ error: 'Cross-tenant access denied' }, { status: 403 })
}

    if (actionRequest.status !== 'pending') {
      return Response.json({ error: 'Already processed' }, { status: 409 })
    }

    const data = actionRequest.payload as any
    const productId =
      typeof actionRequest.product === 'object'
        ? actionRequest.product?.id
        : actionRequest.product

    if (actionRequest.actionType === 'create') {
      await payload.create({
        collection: 'products',
        data,
        draft: false,
        overrideAccess: true,
      })
    }

    if (actionRequest.actionType === 'update' && productId) {
      await payload.update({
        collection: 'products',
        id: productId,
        data,
        draft: false,
        overrideAccess: true,
      })
    }

    if (actionRequest.actionType === 'delete' && productId) {
      await payload.delete({
        collection: 'products',
        id: productId,
        overrideAccess: true,
      })
    }

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
