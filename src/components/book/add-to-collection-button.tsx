"use client";

import { useState } from "react";
import {
  FolderPlusIcon,
  MoreHorizontalIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";
import { toast } from "sonner";

import type { Book } from "@/types/book";
import { useAuthStore } from "@/stores/auth-store";
import { useCollectionsStore } from "@/stores/collections-store";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
import { LoginGateDialog } from "@/components/shared/login-gate-dialog";

// Add-to-Collection flow for the detail page. Guests get the login-gate
// dialog; signed-in users pick one or more collections (or create a new one)
// in a right-side sheet, then Save adds the book with a confirmation toast.
export function AddToCollectionButton({ book }: { book: Book }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const collections = useCollectionsStore((state) => state.collections);
  const addBookToCollections = useCollectionsStore(
    (state) => state.addBookToCollections,
  );
  const createCollection = useCollectionsStore(
    (state) => state.createCollection,
  );
  const renameCollection = useCollectionsStore(
    (state) => state.renameCollection,
  );
  const deleteCollection = useCollectionsStore(
    (state) => state.deleteCollection,
  );

  const [sheetOpen, setSheetOpen] = useState(false);
  const [loginGateOpen, setLoginGateOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Opens the sheet for signed-in users or the login gate for guests.
  function handleOpen() {
    if (!isAuthenticated) {
      setLoginGateOpen(true);
      return;
    }
    setSheetOpen(true);
  }

  // Toggles a collection in/out of the pending selection.
  function toggleSelection(collectionId: string, checked: boolean) {
    setSelectedIds((current) =>
      checked
        ? [...current, collectionId]
        : current.filter((id) => id !== collectionId),
    );
  }

  // Begins inline rename mode for the given collection.
  function startRename(collectionId: string, name: string) {
    setEditingId(collectionId);
    setEditingName(name);
  }

  // Saves the renamed collection (blank names are ignored) with a toast.
  function handleRename() {
    if (!editingId || !editingName.trim()) {
      return;
    }
    renameCollection(editingId, editingName.trim());
    toast.success("Collection renamed");
    setEditingId(null);
    setEditingName("");
  }

  // Deletes the collection and prunes it from the pending selection.
  function handleDelete() {
    if (!deletingId) {
      return;
    }
    deleteCollection(deletingId);
    setSelectedIds((current) => current.filter((id) => id !== deletingId));
    toast("Collection deleted");
    setDeletingId(null);
  }

  // Creates a new collection (if named) and adds the book to every selected
  // one, then closes the sheet with a confirmation toast.
  function handleSave() {
    const targetIds = [...selectedIds];
    if (newCollectionName.trim()) {
      targetIds.push(createCollection(newCollectionName.trim()));
    }
    if (targetIds.length === 0) {
      toast("Select a collection or create a new one");
      return;
    }
    addBookToCollections(book.id, targetIds);
    toast.success(`Added "${book.title}" to your collections`);
    setSheetOpen(false);
    setSelectedIds([]);
    setNewCollectionName("");
  }

  return (
    <>
      <Button variant="outline" size="lg" onClick={handleOpen}>
        <FolderPlusIcon />
        Add to Collection
      </Button>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Add to Collection</SheetTitle>
            <SheetDescription>
              Choose where to keep “{book.title}”.
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-col gap-3 px-4">
            {collections.map((collection) => {
              const isSelected = selectedIds.includes(collection.id);
              const isEditing = editingId === collection.id;

              if (isEditing) {
                return (
                  <div key={collection.id} className="flex items-center gap-2">
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
                );
              }

              return (
                <div key={collection.id} className="flex items-center gap-2">
                  <Label className="flex min-w-0 flex-1 cursor-pointer items-center gap-2">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) =>
                        toggleSelection(collection.id, checked === true)
                      }
                    />
                    <span className="truncate">{collection.name}</span>
                  </Label>
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
                        onClick={() => startRename(collection.id, collection.name)}
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
              );
            })}

            <div className="mt-2 flex gap-2">
              <Input
                placeholder="New collection name"
                value={newCollectionName}
                onChange={(event) => setNewCollectionName(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleSave();
                  }
                }}
              />
            </div>
          </div>

          <SheetFooter>
            <Button variant="outline" onClick={() => setSheetOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <PlusIcon />
              Save
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <LoginGateDialog
        open={loginGateOpen}
        onOpenChange={setLoginGateOpen}
        description="Log in to save books to your personal collections."
      />

      <Dialog open={deletingId !== null} onOpenChange={(open) => !open && setDeletingId(null)}>
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
    </>
  );
}
