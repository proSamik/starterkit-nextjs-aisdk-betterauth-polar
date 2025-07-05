/* eslint-disable @next/next/no-img-element */
"use client";

import {
  AttachmentIcon,
  BotIcon,
  UserIcon,
  VercelIcon,
} from "@/components/icons";
import { useChat } from "@ai-sdk/react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Markdown } from "@/components/markdown";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <div className="flex flex-row justify-center pb-20 h-dvh bg-background text-foreground">
      <div className="flex flex-col justify-between gap-4">
        {messages.length > 0 ? (
          <div className="flex flex-col gap-2 h-full w-dvw items-center overflow-y-scroll">
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                className={`flex flex-row gap-2 px-4 w-full md:w-[500px] md:px-0 ${
                  index === 0 ? "pt-20" : ""
                }`}
                initial={{ y: 5, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                <div className="size-[24px] flex flex-col justify-center items-center flex-shrink-0 text-muted-foreground">
                  {message.role === "assistant" ? <BotIcon /> : <UserIcon />}
                </div>

                <div className="flex flex-col gap-1">
                  <div className="text-foreground flex flex-col gap-4">
                    {message.parts.map((part, index) => {
                      if (part.type === "text") {
                        return <Markdown key={index}>{part.text}</Markdown>;
                      }
                    })}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div className="h-[350px] px-4 w-full md:w-[500px] md:px-0 pt-20">
            <div className="border rounded-lg p-6 flex flex-col gap-4 text-muted-foreground text-sm border-border">
              <p className="flex flex-row justify-center gap-4 items-center text-foreground">
                <VercelIcon />
                <span>+</span>
                <AttachmentIcon />
              </p>
              <p>
                The useChat hook supports sending attachments along with
                messages as well as rendering previews on the client. This can
                be useful for building applications that involve sending images,
                files, and other media content to the AI provider.
              </p>
              <p>
                {" "}
                Learn more about the{" "}
                <Link
                  className="text-primary"
                  href="https://sdk.vercel.ai/docs/ai-sdk-ui/chatbot#attachments-experimental"
                  target="_blank"
                >
                  useChat{" "}
                </Link>
                hook from Vercel AI SDK.
              </p>
            </div>
          </motion.div>
        )}

        <form
          className="flex flex-col gap-2 relative items-center"
          onSubmit={handleSubmit}
        >
          <div className="flex items-center w-full md:max-w-[500px] max-w-[calc(100dvw-32px)] bg-muted rounded-full px-4 py-2">
            <input
              className="bg-transparent flex-grow outline-none text-foreground placeholder-muted-foreground"
              placeholder="Send a message..."
              value={input}
              onChange={handleInputChange}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
