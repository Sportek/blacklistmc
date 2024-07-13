import { AuthorizationError, verifyRoleRequired } from "@/lib/authorizer";
import prisma from "@/lib/prisma";
import { AccountRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { updateBlacklistSchema } from "../../users/[userId]/blacklists/blacklistSchema";

interface UsersUserIdBlacklistsBlacklistIdParams {
  params: {
    blacklistId: string;
  };
}

/**
 * @swagger
 * /api/blacklists/{blacklistId}:
 *   get:
 *     summary: Get a blacklist
 *     tags:
 *       - Blacklists
 *     parameters:
 *       - name: blacklistId
 *         schema:
 *           type: string
 *         description: The id of the blacklist
 *         schema:
 *           type: string
 *         description: The id of the blacklist
 *     responses:
 *       200:
 *         description: The blacklist
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Blacklist"
 *       404:
 *         description: Blacklist not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Error while fetching blacklist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
export async function GET(req: NextRequest, { params }: UsersUserIdBlacklistsBlacklistIdParams) {
  const blacklist = await prisma.blacklist.findUnique({ where: { id: Number(params.blacklistId) } });
  if (!blacklist) {
    return Response.json({ error: "Blacklist not found" }, { status: 404 });
  }
  return Response.json(blacklist, { status: 200 });
}

/**
 * @swagger
 * /api/blacklists/{blacklistId}:
 *   delete:
 *     summary: Delete a blacklist
 *     tags:
 *       - Blacklists
 *     parameters:
 *       - name: blacklistId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The id of the blacklist
 *         schema:
 *           type: string
 *         description: The id of the blacklist
 *     responses:
 *       204:
 *         description: No content, successfully deleted
 *       404:
 *         description: Blacklist not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Error while deleting blacklist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
export async function DELETE(req: NextRequest, { params }: UsersUserIdBlacklistsBlacklistIdParams) {
  try {
    verifyRoleRequired(AccountRole.ADMIN, req);
    const blacklist = await prisma.blacklist.findUnique({ where: { id: Number(params.blacklistId) } });
    if (!blacklist) {
      return Response.json({ error: "Blacklist not found" }, { status: 404 });
    }
    await prisma.blacklist.delete({ where: { id: Number(params.blacklistId) } });
    return Response.json(null, { status: 204 });
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
  }
}

/**
 * @swagger
 * /api/blacklists/{blacklistId}:
 *   patch:
 *     summary: Update a blacklist
 *     tags:
 *       - Blacklists
 *     parameters:
 *       - name: blacklistId
 *         schema:
 *           type: string
 *         description: The id of the blacklist
 *       - name: blacklistId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The id of the blacklist
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the blacklist
 *               description:
 *                 type: string
 *                 description: The description of the blacklist
 *               askedByUserId:
 *                 type: string
 *                 nullable: true
 *                 description: The id of the user who updated the blacklist
 *               expireAt:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *                 description: The end date of the blacklist
 *               channelId:
 *                 type: string
 *                 nullable: true
 *                 description: The id of the channel related to the blacklist
 *     responses:
 *       200:
 *         description: The updated blacklist
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Blacklist"
 *       400:
 *         description: Invalid data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 details:
 *                   type: object
 *                   additionalProperties:
 *                     type: array
 *                     items:
 *                       type: string
 *       404:
 *         description: User or asked by user not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Error while updating blacklist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
export async function PATCH(req: NextRequest, { params }: UsersUserIdBlacklistsBlacklistIdParams) {
  try {
    const { title, description, askedByUserId, expireAt, channelId } = await req.json();
    const validated = updateBlacklistSchema.safeParse({ title, description, askedByUserId, expireAt, channelId });
    if (!validated.success) {
      const errorMessages = validated.error.flatten().fieldErrors;
      return Response.json({ error: "Invalid data", details: errorMessages }, { status: 400 });
    }

    if (askedByUserId) {
      const askedByUser = await prisma.user.findUnique({ where: { id: askedByUserId } });
      if (!askedByUser) {
        return Response.json({ error: "Asked by user not found" }, { status: 404 });
      }

      await prisma.blacklist.update({
        where: { id: Number(params.blacklistId) },
        data: { askedByUserId },
      });
    }

    const blacklist = await prisma.blacklist.update({
      where: { id: Number(params.blacklistId) },
      data: { title, description, expireAt, channelId },
    });
    return Response.json(blacklist, { status: 200 });
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
  }
}
