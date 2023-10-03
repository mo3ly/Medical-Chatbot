
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
        
    const { chatId } = req.body
    
    // todo: validate that user can see that conversition

    if (req.method === 'POST') {
        try {
            const conversition = await await prisma.message.findMany({
                where: {
                    chatId: chatId,
                },
              })
            res.status(200).json({ conversition })
        } catch (error) {
            res.status(500).send("Error while fetching the conversition")
        } 
    } else {
        throw new Error(
            `The HTTP ${req.method} method is not supported at this route.`,
        );
    }
}

