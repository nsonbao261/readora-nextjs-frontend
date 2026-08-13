"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import { toast } from "sonner";

import type { Book } from "@/types/book";
import { useCollectionsStore } from "@/stores/collections-store";
import { books } from "@/data/books";
import { BookCard } from "@/components/book/book-card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

// Collection detail page: resolves the collection from the store by slug,
// shows its books in a grid (BookCard + remove control), and supports inline
// rename + confirm-delete (delete returns to the list). Unknown slugs render a
// not-found empty state (FR-5.3, 5.4).
export function CollectionDetail({ slug }: { slug: string }) {
  const router = useRouter();
  const collection = useCollectionsStore((state) =>
    state.collections.find((candidate) => candidate.id === slug),
  );
  const renameCollection = useCollectionsStore(
    (state) => state.renameCollection,
  );
  const deleteCollection = useCollectionsStore(
    (state) => state.deleteCollection,
  );
  const removeBookFromCollection = useCollectionsStore(
    (state) => state.removeBookFromCollection,
  );

  const [isEditing, setIsEditing] = useState(false);
  const [editingName, setEditingName] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Unknown id → not-found style empty state (the shell keeps the nav up).
  if (!collection) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed py-16 text-center">
        <h1 className="font-heading text-xl font-medium">
          Collection not found
        </h1>
        <p className="text-muted-foreground">
          This collection doesn&apos;t exist or was deleted.
        </p>
        <Link
          href="/account/collections"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          <ArrowLeftIcon />
          Back to collections
        </Link>
      </div>
    );
  }

  const collectionBooks = collection.bookIds
    .map((id) => books.find((book) => book.id === id))
    .filter((book): book is Book => book !== undefined);
  const { id, name, bookIds } = collection;
  const countLabel =
    bookIds.length === 1 ? "1 book" : `${bookIds.length} books`;

  function startRename() {
    setIsEditing(true);
    setEditingName(name);
  }

  function handleRename() {
    const nextName = editingName.trim();
    if (!nextName) return;
    renameCollection(id, nextName);
    toast.success("Collection renamed");
    setIsEditing(false);
  }

  function handleDelete() {
    deleteCollection(id);
    toast("Collection deleted");
    router.push("/account/collections");
  }

  function handleRemoveBook(bookId: string) {
    removeBookFromCollection(id, bookId);
    toast("Book removed from collection");
  }

  return (
    <div>
      <header className="mb-6">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-primary">
          Account
        </p>
        <Link
          href="/account/collections"
          className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          <ArrowLeftIcon className="size-4" />
          Collections
        </Link>

        {isEditing ? (
          <div className="mt-3 flex max-w-md items-center gap-2">
            <Input
              value={editingName}
              onChange={(event) => setEditingName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleRename();
                }
              }}
              autoFocus
            />
            <Button size="sm" onClick={handleRename} className="shrink-0">
              Save
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(false)}
              className="shrink-0"
            >
              Cancel
            </Button>
          </div>
        ) : (
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="font-heading text-3xl font-medium tracking-tight">
                {name}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">{countLabel}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={startRename}
                className="cursor-pointer"
              >
                <PencilIcon />
                Rename
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDeleteOpen(true)}
                className="cursor-pointer text-destructive"
              >
                <Trash2Icon />
                Delete
              </Button>
            </div>
          </div>
        )}
      </header>

      {collectionBooks.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed py-16 text-center">
          <h2 className="font-heading text-xl font-medium">
            No books in this collection
          </h2>
          <p className="text-muted-foreground">
            Browse the catalog and add books to keep here.
          </p>
          <Link href="/book" className={cn(buttonVariants({ variant: "outline" }))}>
            <PlusIcon />
            Browse books
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {collectionBooks.map((book) => (
            <div key={book.id}>
              <BookCard book={book} />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveBook(book.id)}
                className="mt-2 w-full cursor-pointer text-muted-foreground hover:text-destructive"
              >
                <XIcon />
                Remove from collection
              </Button>
            </div>
          ))}
        </div>
      )}

      <Dialog
        open={deleteOpen}
        onOpenChange={(open) => !open && setDeleteOpen(false)}
      >
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Delete collection?</DialogTitle>
            <DialogDescription>
              This permanently removes “{name}”. Books already in
              it aren&apos;t affected.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
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
