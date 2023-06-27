import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { collectionCardValidationSchema } from 'validationSchema/collection-cards';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.collection_card
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getCollectionCardById();
    case 'PUT':
      return updateCollectionCardById();
    case 'DELETE':
      return deleteCollectionCardById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getCollectionCardById() {
    const data = await prisma.collection_card.findFirst(convertQueryToPrismaUtil(req.query, 'collection_card'));
    return res.status(200).json(data);
  }

  async function updateCollectionCardById() {
    await collectionCardValidationSchema.validate(req.body);
    const data = await prisma.collection_card.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteCollectionCardById() {
    const data = await prisma.collection_card.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
