"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FolderIcon,
  MoreHorizontalIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";
import { toast } from "sonner";

import type { Book } from "@/types/book";
import { useCollectionsStore } from "@/stores/collections-store";
import { books } from "@/data/books";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Resolves up to three covers from a collection's book ids for the card
// preview; books that no longer exist in the catalog are skipped.
function collectionCovers(bookIds: string[]): Book[] {
  return bookIds
    .map((id) => books.find((book) => book.id === id))
    .filter((book): book is Book => book !== undefined)
    .slice(0, 3);
}

// All collections for the signed-in user: cover-preview grid with create
// (dialog), inline rename, and confirm-delete. Every mutation toasts and only
// the collection record is dropped — books are untouched (FR-5.1, 5.2, 5.5).
export function CollectionsList() {
  const collections = useCollectionsStore((state) => state.collections);
  const createCollection = useCollectionsStore(
    (state) => state.createCollection,
  );
  const renameCollection = useCollectionsStore(
    (state) => state.renameCollection,
  );
  const deleteCollection = useCollectionsStore(
    (state) => state.deleteCollection,
  );

  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function handleCreate() {
    const name = newName.trim();
    if (!name) return;
    createCollection(name);
    toast.success("Collection created");
    setNewName("");
    setCreateOpen(false);
  }

  function startRename(id: string, name: string) {
    setEditingId(id);
    setEditingName(name);
  }

  function handleRename() {
    if (!editingId) return;
    const name = editingName.trim();
    if (!name) return;
    renameCollection(editingId, name);
    toast.success("Collection renamed");
    setEditingId(null);
    setEditingName("");
  }

  function handleDelete() {
    if (!deletingId) return;
    deleteCollection(deletingId);
    toast("Collection deleted");
    setDeletingId(null);
  }

  return (
    <div>
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-primary">
            Account
          </p>
          <h1 className="mt-2 font-heading text-3xl font-medium tracking-tight">
            Collections
          </h1>
          <p className="mt-2 text-muted-foreground">
            Group books your way — create, rename, or tidy up your shelves.
          </p>
        </div>
        <Button className="cursor-pointer" onClick={() => setCreateOpen(true)}>
          <PlusIcon />
          New collection
        </Button>
      </header>

      {collections.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed py-16 text-center">
          <h2 className="font-heading text-xl font-medium">
            No collections yet
          </h2>
          <p className="text-muted-foreground">
            Create your first collection to keep books together.
          </p>
          <Button
            className="cursor-pointer"
            variant="outline"
            onClick={() => setCreateOpen(true)}
          >
            <PlusIcon />
            New collection
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection) => {
            const covers = collectionCovers(collection.bookIds);
            const isEditing = editingId === collection.id;
            const detailHref = `/account/collections/${collection.id}`;
            const countLabel =
              collection.bookIds.length === 1
                ? "1 book"
                : `${collection.bookIds.length} books`;

            return (
              <Card
                key={collection.id}
                className="group/collection overflow-hidden transition-colors hover:ring-primary/40"
              >
                <Link
                  href={detailHref}
                  className="block focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  {covers.length > 0 ? (
                    <div className="grid aspect-[3/2] grid-cols-3 gap-1 rounded-t-xl bg-muted/40 p-1">
                      {covers.map((book) => (
                        <div
                          key={book.id}
                          className="relative overflow-hidden rounded-md"
                        >
                          <Image
                            src={book.cover}
                            alt={`${book.title} cover`}
                            fill
                            sizes="(min-width: 1024px) 15vw, 30vw"
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid aspect-[3/2] place-items-center rounded-t-xl bg-muted/50">
                      <FolderIcon className="size-8 text-muted-foreground/60" />
                    </div>
                  )}
                </Link>

                {isEditing ? (
                  <div className="flex items-center gap-2 p-4">
                    <Input
                      value={editingName}
                      onChange={(event) => setEditingName(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          handleRename();
                        }
                      }}
                      className="h-8"
                      autoFocus
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRename}
                      className="shrink-0"
                    >
                      Save
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingId(null)}
                      className="shrink-0"
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-2 p-4">
                    <Link
                      href={detailHref}
                      className="min-w-0 rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                    >
                      <p className="font-heading text-base font-medium truncate hover:underline">
                        {collection.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {countLabel}
                      </p>
                    </Link>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`Manage ${collection.name}`}
                          />
                        }
                      >
                        <MoreHorizontalIcon />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() =>
                            startRename(collection.id, collection.name)
                          }
                        >
                          <PencilIcon />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          variant="destructive"
                          className="cursor-pointer"
                          onClick={() => setDeletingId(collection.id)}
                        >
                          <Trash2Icon />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>New collection</DialogTitle>
            <DialogDescription>
              Give your collection a name to get started.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={newName}
            onChange={(event) => setNewName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                handleCreate();
              }
            }}
            placeholder="e.g. Summer reads"
            autoFocus
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setNewName("");
                setCreateOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={!newName.trim()}>
              <PlusIcon />
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={deletingId !== null}
        onOpenChange={(open) => !open && setDeletingId(null)}
      >
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Delete collection?</DialogTitle>
            <DialogDescription>
              This permanently removes the collection. Books already in it
              aren&apos;t affected.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2Icon />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
