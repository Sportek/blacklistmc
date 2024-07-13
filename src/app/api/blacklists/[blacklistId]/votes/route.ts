import { AuthorizationError, hasAtLeastRole, verifyRoleRequired } from "@/lib/authorizer";
import prisma from "@/lib/prisma";
import { AccountRole, BlacklistStatus, BlacklistVoteState } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

interface VoteParams {
  params: {
    blacklistId: string;
  };
}

/**
 * @swagger
 * /api/blacklists/{blacklistId}/votes:
 *   get:
 *     summary: Get all votes for a blacklist
 *     tags:
 *       - Blacklists
 *     parameters:
 *       - name: blacklistId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the blacklist
 *     responses:
 *       200:
 *         description: The votes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/ModeratorVote"
 *       404:
 *         description: Blacklist not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Blacklist not found
 *       403:
 *         description: User not authorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User not authorized
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
export async function GET(req: NextRequest, { params }: VoteParams) {
  try {
    await verifyRoleRequired(AccountRole.SUPPORT, req);

    const blacklist = await prisma.blacklist.findUnique({
      where: {
        id: parseInt(params.blacklistId),
      },
      include: {
        votes: {
          include: {
            moderator: true,
          },
        },
      },
    });

    if (!blacklist) return NextResponse.json({ error: "Blacklist not found" }, { status: 404 });

    return NextResponse.json(blacklist.votes);
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/blacklists/{blacklistId}/votes:
 *   post:
 *     summary: Add a vote to a blacklist
 *     tags:
 *       - Blacklists
 *     parameters:
 *       - name: blacklistId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the blacklist
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               vote:
 *                 type: boolean
 *               voterId:
 *                 type: string
 *     responses:
 *       200:
 *         description: The created vote
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ModeratorVote"
 *       404:
 *         description: Blacklist or voter not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Blacklist or voter not found
 *       400:
 *         description: Blacklist is not pending or vote state does not allow new votes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Blacklist is not pending or vote state does not allow new votes
 *       403:
 *         description: Voter not allowed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Voter not allowed
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
export async function POST(req: NextRequest, { params }: VoteParams) {
  try {
    await verifyRoleRequired(AccountRole.SUPPORT, req);

    const { vote, voterId } = await req.json();

    const blacklist = await prisma.blacklist.findUnique({
      where: {
        id: parseInt(params.blacklistId),
      },
    });
    if (!blacklist) return NextResponse.json({ error: "Blacklist not found" }, { status: 404 });

    if(blacklist.status !== BlacklistStatus.PENDING) return NextResponse.json({ error: "Blacklist is not pending" }, { status: 400 });

    const voterAccount = await prisma.account.findUnique({
      where: {
        userId: voterId,
      },
    });
    if (!voterAccount) return NextResponse.json({ error: "Voter not found" }, { status: 404 });
    if(blacklist.voteState !== BlacklistVoteState.PENDING) return NextResponse.json({ error: "Blacklist vote state does not allow new votes" }, { status: 400 });
    
    const roleRequiredToVote = blacklist.voteState === BlacklistVoteState.PENDING ? AccountRole.SUPPORT : AccountRole.SUPERVISOR;
    if(!hasAtLeastRole(roleRequiredToVote, voterAccount.role)) return NextResponse.json({ error: "Voter not allowed" }, { status: 403 });


    const hasAlreadyVoted = await prisma.moderatorVote.findFirst({
      where: {
        moderatorId: voterAccount.userId,
        blacklistId: blacklist.id,
      },
    });

    if(hasAlreadyVoted) {

      const updateVote = await prisma.moderatorVote.update({
        where: {
          id: hasAlreadyVoted.id,
        },
        data: {
          vote,
        },
      });

      return NextResponse.json(updateVote);
    };


    const createdVote = await prisma.moderatorVote.create({
      data: {
        vote,
        moderator: {
          connect: {
            id: voterAccount.userId,
          },
        },
        blacklist: {
          connect: {
            id: blacklist.id,
          },
        }
      },
    });

    return NextResponse.json(createdVote);


  } catch (error) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
