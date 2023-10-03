import prisma from "@/lib/prisma";
import axios from "@/lib/axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

    const { query, chatId } = req.body

    if (req.method === 'POST') {

        let queryResponse = null

        await axios
            .post("/predict", { input_text: query } )
            .then((response) => {
                console.log(response)
                queryResponse = response.data.response == "No intent found" ? "Sorry, iam unable to find an answer for that question." : response.data.response;
            })
            .catch((error) => {    
                console.log(error)        
                res.status(500).send("error while reatching the api.")
            });

        try {
            if (queryResponse == null)
                return

            const message = await prisma.message.createMany({
                data: [
                    {
                        text: query,
                        isFromBot: false,
                        chatId: chatId,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        text: queryResponse,
                        isFromBot: true,
                        chatId: chatId,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                ]
              });

            res.status(200).json({ queryResponse })
        } catch (error) {
            console.log(error)
            res.status(500).send("error while fetching a new query!")
        } 
    } else {
        throw new Error(
            `The HTTP ${req.method} method is not supported at this route.`,
        );
    }
}
