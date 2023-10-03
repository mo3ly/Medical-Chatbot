import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const session = await getSession({ req });

    const { title } = req.body

    if (req.method === 'POST') {
        try {
            const chat = await prisma.chat.create({
                data: {
                  title,
                  User: { connect: { email: session?.user?.email || "" } },
                  createdAt: new Date(),
                  updatedAt: new Date()
                },
              });

            res.status(200).json({ chat })
        } catch (error) {
            res.status(500).send("error while creating a new chat!")
        } 
    } else {
        throw new Error(
            `The HTTP ${req.method} method is not supported at this route.`,
        );
    }
}
