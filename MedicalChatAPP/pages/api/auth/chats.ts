
import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const session = await getSession({ req });

    if(!session?.user?.email) 
        return res.status(500).send("Error while fetching the chats user is not found")

    if (req.method === 'GET') {
        try {
            const chats = await await prisma.chat.findMany({
                where: {
                  User: {
                    email: session?.user?.email,
                  },
                },
                orderBy: { id: 'desc' }
              })
            res.status(200).json({ chats })
        } catch (error) {
            res.status(500).send("Error while fetching the chats")
        } 
    } else {
        throw new Error(
            `The HTTP ${req.method} method is not supported at this route.`,
        );
    }
}

