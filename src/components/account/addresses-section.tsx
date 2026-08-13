"use client";

import { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  MapPinIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";
import { toast } from "sonner";

import type { Address } from "@/types/address";
import { addresses as seedAddresses } from "@/data/addresses";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { FormField } from "@/components/auth/form-field";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const addressSchema = z.object({
  recipientName: z.string().min(2, "Recipient name is required"),
  provinceCity: z.string().min(1, "Province/City is required"),
  district: z.string().min(1, "District is required"),
  ward: z.string().min(1, "Ward/Commune is required"),
  street: z.string().min(1, "Street address is required"),
});

type AddressValues = z.infer<typeof addressSchema>;

const emptyValues: AddressValues = {
  recipientName: "",
  provinceCity: "",
  district: "",
  ward: "",
  street: "",
};

// Address book: cards with a placeholder map image (GMaps swap point), the
// recipient, full address and a Primary badge. Create/edit happen in a dialog
// (5 required fields); set-primary keeps exactly one primary; delete confirms
// and promotes the first remaining address if the primary was removed (FR-7.1..7.6).
export function AddressesSection() {
  const [items, setItems] = useState<Address[]>(seedAddresses);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddressValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: emptyValues,
  });

  function openCreate() {
    setEditingId(null);
    reset(emptyValues);
    setDialogOpen(true);
  }

  function openEdit(address: Address) {
    setEditingId(address.id);
    reset({
      recipientName: address.recipientName,
      provinceCity: address.provinceCity,
      district: address.district,
      ward: address.ward,
      street: address.street,
    });
    setDialogOpen(true);
  }

  function closeDialog() {
    setDialogOpen(false);
    setEditingId(null);
  }

  // Create appends a new address (first one becomes primary automatically);
  // edit patches the matching address in place.
  function onSubmit(values: AddressValues) {
    if (editingId) {
      setItems((current) =>
        current.map((address) =>
          address.id === editingId ? { ...address, ...values } : address,
        ),
      );
      toast.success("Address updated");
    } else {
      setItems((current) => [
        ...current,
        {
          id: `addr-${crypto.randomUUID()}`,
          ...values,
          isPrimary: current.length === 0,
        },
      ]);
      toast.success("Address added");
    }
    closeDialog();
  }

  // Re-marks the target as primary, clearing every other address (exactly one
  // primary at a time).
  function handleSetPrimary(id: string) {
    setItems((current) =>
      current.map((address) => ({
        ...address,
        isPrimary: address.id === id,
      })),
    );
    toast.success("Primary address updated");
  }

  // Deleting the primary promotes the first remaining address to primary.
  function handleDelete() {
    if (!deletingId) return;
    setItems((current) => {
      const target = current.find((address) => address.id === deletingId);
      const remaining = current.filter((address) => address.id !== deletingId);
      if (target?.isPrimary && remaining.length > 0) {
        return remaining.map((address, index) =>
          index === 0 ? { ...address, isPrimary: true } : address,
        );
      }
      return remaining;
    });
    toast("Address deleted");
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
            Addresses
          </h1>
          <p className="mt-2 text-muted-foreground">
            Where should we send your books?
          </p>
        </div>
        <Button className="cursor-pointer" onClick={openCreate}>
          <PlusIcon />
          Add address
        </Button>
      </header>

      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed py-16 text-center">
          <div className="rounded-full border border-dashed border-border p-3">
            <MapPinIcon className="size-6 text-muted-foreground" />
          </div>
          <h2 className="font-heading text-xl font-medium">
            No saved addresses
          </h2>
          <p className="text-muted-foreground">
            Add an address to speed up checkout.
          </p>
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={openCreate}
          >
            <PlusIcon />
            Add address
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((address) => (
            <Card key={address.id} className="overflow-hidden">
              {/* SWAP: Google Maps embed replaces this placeholder (FR-7.1). */}
              <div className="relative aspect-[2/1]">
                <Image
                  src="/assets/placeholder/map-placeholder.svg"
                  alt={`Map showing ${address.provinceCity}`}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col gap-2 p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-heading text-base font-medium">
                    {address.recipientName}
                  </p>
                  {address.isPrimary && <Badge>Primary</Badge>}
                </div>
                <p className="text-sm text-muted-foreground">
                  {address.street}, {address.ward}, {address.district},{" "}
                  {address.provinceCity}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {!address.isPrimary && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetPrimary(address.id)}
                      className="cursor-pointer"
                    >
                      Set as primary
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEdit(address)}
                    className="cursor-pointer"
                  >
                    <PencilIcon />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeletingId(address.id)}
                    className="cursor-pointer text-destructive"
                  >
                    <Trash2Icon />
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit address" : "Add address"}</DialogTitle>
            <DialogDescription>
              Fill in every field so we can deliver reliably.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
            noValidate
          >
            <FormField
              label="Recipient name"
              htmlFor="address-recipient"
              error={errors.recipientName?.message}
            >
              <Input
                id="address-recipient"
                placeholder="Jane Doe"
                aria-invalid={errors.recipientName ? true : undefined}
                {...register("recipientName")}
              />
            </FormField>

            <FormField
              label="Province / City"
              htmlFor="address-city"
              error={errors.provinceCity?.message}
            >
              <Input
                id="address-city"
                placeholder="Ho Chi Minh City"
                aria-invalid={errors.provinceCity ? true : undefined}
                {...register("provinceCity")}
              />
            </FormField>

            <FormField
              label="District"
              htmlFor="address-district"
              error={errors.district?.message}
            >
              <Input
                id="address-district"
                placeholder="District 1"
                aria-invalid={errors.district ? true : undefined}
                {...register("district")}
              />
            </FormField>

            <FormField
              label="Ward / Commune"
              htmlFor="address-ward"
              error={errors.ward?.message}
            >
              <Input
                id="address-ward"
                placeholder="Ben Nghe"
                aria-invalid={errors.ward ? true : undefined}
                {...register("ward")}
              />
            </FormField>

            <FormField
              label="Street address"
              htmlFor="address-street"
              error={errors.street?.message}
            >
              <Input
                id="address-street"
                placeholder="123 Le Loi Street"
                aria-invalid={errors.street ? true : undefined}
                {...register("street")}
              />
            </FormField>

            <DialogFooter>
              <Button
                variant="outline"
                type="button"
                onClick={closeDialog}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving…" : "Save address"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={deletingId !== null}
        onOpenChange={(open) => !open && setDeletingId(null)}
      >
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Delete address?</DialogTitle>
            <DialogDescription>
              This removes the saved address from your account.
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
