import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { collectionValidationSchema } from 'validationSchema/collections';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.collection
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getCollectionById();
    case 'PUT':
      return updateCollectionById();
    case 'DELETE':
      return deleteCollectionById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getCollectionById() {
    const data = await prisma.collection.findFirst(convertQueryToPrismaUtil(req.query, 'collection'));
    return res.status(200).json(data);
  }

  async function updateCollectionById() {
    await collectionValidationSchema.validate(req.body);
    const data = await prisma.collection.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteCollectionById() {
    const data = await prisma.collection.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
