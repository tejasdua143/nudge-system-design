"use client";

import { useState } from "react";
import { Plus, DotsThreeVertical } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

/* -------------------------------------------------------------------------- */
/*  Data                                                                      */
/* -------------------------------------------------------------------------- */

const MEMBERS = [
  { name: "John Doe", email: "johndoe@gmail.com", role: "Owner", initials: "JD" },
  { name: "Sarah Chen", email: "sarah.chen@foursquare.ai", role: "Admin", initials: "SC" },
  { name: "Mike Johnson", email: "mike.j@foursquare.ai", role: "Member", initials: "MJ" },
  { name: "Emily Park", email: "emily.park@foursquare.ai", role: "Member", initials: "EP" },
];

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function MembersPage() {
  const [email, setEmail] = useState("");
  const [open, setOpen] = useState(false);

  return (
    <main className="flex flex-1 flex-col overflow-hidden rounded-xl bg-bg-primary shadow-elevation-3">
      {/* Header */}
      <div className="flex h-[63px] items-center justify-between border-b border-border-secondary px-6">
        <h1 className="text-[length:var(--text-2xl)] leading-[var(--leading-heading)] tracking-tight text-text-primary">
          Members
        </h1>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEmail(""); }}>
          <DialogTrigger asChild>
            <Button variant="primary" size="sm">
              <Plus weight="bold" className="size-3" />
              Invite member
            </Button>
          </DialogTrigger>
          <DialogContent size="sm">
            <DialogHeader>
              <DialogTitle>Invite member</DialogTitle>
              <DialogDescription>
                Enter the email address of the person you want to invite.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-2 px-4 py-2">
              <label htmlFor="invite-email" className="text-[length:var(--text-base)] font-medium text-text-primary">
                Email address
              </label>
              <Input
                id="invite-email"
                type="email"
                placeholder="e.g. name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" size="sm">Cancel</Button>
              </DialogClose>
              <Button variant="primary" size="sm" disabled={!email.trim()} onClick={() => setOpen(false)}>
                Send invite
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto flex w-full max-w-[768px] flex-col gap-6 px-6 py-6">
          {/* Description */}
          <p className="text-[length:var(--text-base)] text-text-secondary">
            Manage your workspace members and their roles. Invite new members to
            collaborate on presentations and API integrations.
          </p>

          {/* Table */}
          <div className="overflow-hidden rounded-lg shadow-elevation-1">
            {/* Table header */}
            <div className="flex items-center bg-bg-secondary px-4 py-3 text-[length:var(--text-xs)] font-medium text-text-secondary">
              <span className="flex-1">Member</span>
              <span className="w-[120px]">Role</span>
              <span className="w-[80px] text-right">Action</span>
            </div>

            {/* Table rows */}
            <div className="divide-y divide-border-tertiary bg-bg-elevated">
              {MEMBERS.map((member) => (
                <div
                  key={member.email}
                  className="flex items-center px-4 py-3 text-[length:var(--text-base)]"
                >
                  <div className="flex flex-1 items-center gap-3">
                    <Avatar className="size-8">
                      <AvatarFallback className="bg-bg-secondary text-[length:var(--text-xs)]">
                        {member.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium text-text-primary">
                        {member.name}
                      </span>
                      <span className="text-[length:var(--text-xs)] text-text-tertiary">
                        {member.email}
                      </span>
                    </div>
                  </div>
                  <span className="w-[120px]">
                    <Badge variant={member.role === "Owner" ? "default" : "secondary"}>
                      {member.role}
                    </Badge>
                  </span>
                  <div className="flex w-[80px] justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-xs">
                          <DotsThreeVertical
                            weight="bold"
                            className="size-4 text-text-secondary"
                          />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Change role</DropdownMenuItem>
                        <DropdownMenuItem variant="destructive">
                          Remove member
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
