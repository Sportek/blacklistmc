import { createSwaggerSpec } from "next-swagger-doc";

export const getApiDocs = async () => {
  const spec = createSwaggerSpec({
    apiFolder: "src/app/api",
    definition: {
      openapi: "3.0.0",
      info: {
        title: "BlacklistMC Api Documentation",
        version: "1.0.0",
      },
      components: {
        securitySchemes: {
          BearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
        schemas: {
          User: {
            type: "object",
            properties: {
              id: { type: "string" },
              imageUrl: { type: "string" },
              imageTag: { type: "string" },
              displayName: { type: "string" },
              username: { type: "string" },
              createdAt: { type: "string", format: "date-time" },
              updatedAt: { type: "string", format: "date-time" },
              Blacklist: {
                type: "array",
                items: { $ref: "#/components/schemas/Blacklist" },
              },
              votes: {
                type: "array",
                items: { $ref: "#/components/schemas/ModeratorVote" },
              },
              UserHistory: {
                type: "array",
                items: { $ref: "#/components/schemas/UserHistory" },
              },
              groupId: { type: "string", nullable: true },
              group: { $ref: "#/components/schemas/UserGroup" },
            },
          },
          Account: {
            type: "object",
            properties: {
              id: { type: "string" },
              email: { type: "string" },
              userId: { type: "string" },
              user: { $ref: "#/components/schemas/User" },
              role: { type: "string", enum: ["USER", "MODERATOR", "ADMIN"] },
              createdAt: { type: "string", format: "date-time" },
              updatedAt: { type: "string", format: "date-time" },
            },
          },
          Blacklist: {
            type: "object",
            properties: {
              id: { type: "integer" },
              userId: { type: "string" },
              user: { $ref: "#/components/schemas/User" },
              askedByUserId: { type: "string" },
              askedByUser: { $ref: "#/components/schemas/User" },
              title: { type: "string", nullable: true },
              description: { type: "string", nullable: true },
              proofs: {
                type: "array",
                items: { $ref: "#/components/schemas/Proof" },
              },
              createdAt: { type: "string", format: "date-time" },
              expireAt: { type: "string", format: "date-time", nullable: true },
              updatedAt: { type: "string", format: "date-time" },
              status: { type: "string", enum: ["PENDING", "APPROVED", "REJECTED"] },
              channelId: { type: "string", nullable: true },
              voteEndAt: { type: "string", format: "date-time", nullable: true },
              voteState: { type: "string", enum: ["PENDING", "EVIDENCE", "BLACKLIST"] },
              votes: {
                type: "array",
                items: { $ref: "#/components/schemas/ModeratorVote" },
              },
            },
          },
          ModeratorVote: {
            type: "object",
            properties: {
              id: { type: "string" },
              voteState: { type: "string", enum: ["PENDING", "EVIDENCE", "BLACKLIST"] },
              blacklistId: { type: "integer" },
              blacklist: { $ref: "#/components/schemas/Blacklist" },
              moderatorId: { type: "string" },
              moderator: { $ref: "#/components/schemas/User" },
              vote: { type: "boolean" },
              createdAt: { type: "string", format: "date-time" },
              updatedAt: { type: "string", format: "date-time" },
            },
          },
          Proof: {
            type: "object",
            properties: {
              id: { type: "string" },
              isPublic: { type: "boolean" },
              type: { type: "string", enum: ["VIDEO", "IMAGE", "FILE"] },
              url: { type: "string" },
              blacklistId: { type: "integer" },
              blacklist: { $ref: "#/components/schemas/Blacklist" },
              createdAt: { type: "string", format: "date-time" },
              updatedAt: { type: "string", format: "date-time" },
            },
          },
          UserHistory: {
            type: "object",
            properties: {
              id: { type: "string" },
              userId: { type: "string" },
              user: { $ref: "#/components/schemas/User" },
              imageUrl: { type: "string" },
              displayName: { type: "string" },
              username: { type: "string" },
              createdAt: { type: "string", format: "date-time" },
            },
          },
          UserGroup: {
            type: "object",
            properties: {
              id: { type: "string" },
              users: {
                type: "array",
                items: { $ref: "#/components/schemas/User" },
              },
              createdAt: { type: "string", format: "date-time" },
              updatedAt: { type: "string", format: "date-time" },
            },
          },
          // Ajouter uniquement les schémas nécessaires pour la documentation de cette route
          DiscordUser: {
            type: "object",
            properties: {
              id: { type: "string" },
              username: { type: "string" },
              discriminator: { type: "string" },
              avatar: { type: "string" },
              global_name: { type: "string" },
              email: { type: "string" },
            },
          },
          DiscordToken: {
            type: "object",
            properties: {
              token_type: { type: "string" },
              access_token: { type: "string" },
              expires_in: { type: "integer" },
              refresh_token: { type: "string" },
              scope: { type: "string" },
            },
          },
        },
      },
      security: [{ BearerAuth: [] }],
      tags: [
        {
          name: "Accounts",
        },
        {
          name: "Blacklists",
        },
        {
          name: "Users",
        },
        {
          name: "Proofs",
        },
      ],
    },
  });
  return spec;
};
