import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { tradingCardValidationSchema } from 'validationSchema/trading-cards';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getTradingCards();
    case 'POST':
      return createTradingCard();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getTradingCards() {
    const data = await prisma.trading_card
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'trading_card'));
    return res.status(200).json(data);
  }

  async function createTradingCard() {
    await tradingCardValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.collection_card?.length > 0) {
      const create_collection_card = body.collection_card;
      body.collection_card = {
        create: create_collection_card,
      };
    } else {
      delete body.collection_card;
    }
    const data = await prisma.trading_card.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
