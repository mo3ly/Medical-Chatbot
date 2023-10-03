import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const session = await getSession({ req });

    const { id } = req.body

    if (req.method === 'POST') {
        try {
            await prisma.chat.deleteMany({
                where: {
                  id,
                  User: {
                    email: session?.user?.email || "",
                  },
                },
              });

            res.status(200).send("deleted successfully.")
        } catch (error) {
            res.status(500).send("error while deleting a chat!")
        } 
    } else {
        throw new Error(
            `The HTTP ${req.method} method is not supported at this route.`,
        );
    }
}
