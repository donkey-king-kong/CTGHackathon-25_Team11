"use client";

import * as React from "react";
import * as Popover from "@radix-ui/react-popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export function MultiDonorSelect({ value = [], onChange }) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [donors, setDonors] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [donorCache, setDonorCache] = React.useState<Record<string, string>>({});

  // Fetch donors for search
  React.useEffect(() => {
    if (search.length === 0) {
      setDonors([]);
      return;
    }

    const timeout = setTimeout(async () => {
      setLoading(true);

      let query = supabase
        .from("profiles")
        .select("*")
        .eq("role", "donor");

        
      if (search) {
        query = query.ilike("full_name", `%${search}%`);
      }

      query = query.limit(20);

      const { data, error } = await query;
    //   console.log(data)

      if (!error && data) {
        setDonors(data);
        setDonorCache((prev) => ({
          ...prev,
          ...Object.fromEntries(data.map((d) => [d.id, d.full_name])),
        }));
      }
      setLoading(false);
    }, 300);

    return () => clearTimeout(timeout);
  }, [search]);

  const handleSelect = (donor) => {
    if (!value.includes(donor.id)) {
      onChange([...value, donor.id]);
      setDonorCache((prev) => ({ ...prev, [donor.id]: donor.full_name }));
    }
    setSearch("");
  };

  const handleRemove = (id) => {
    onChange(value.filter((d) => d !== id));
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <div
          className="flex items-center flex-wrap gap-1 w-[320px] border rounded-md px-2 py-1 cursor-text"
          onClick={() => setOpen(true)}
        >
          {value.map((id) => (
            <span
              key={id}
              className="inline-flex items-center px-2 py-1 text-sm rounded-full bg-muted"
            >
              {donorCache[id] || id}
              <button
                type="button"
                className="ml-1 text-muted-foreground hover:text-foreground"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(id);
                }}
              >
                ✕
              </button>
            </span>
          ))}
          <input
            className="flex-1 bg-transparent outline-none text-sm"
            placeholder="Add donor…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setOpen(true)}
          />
        </div>
      </Popover.Trigger>

      <Popover.Content
        className="w-[320px] p-0"
        align="start"
        sideOffset={4}
        onOpenAutoFocus={(e) => e.preventDefault()}   // ✅ keep popover open
        onCloseAutoFocus={(e) => e.preventDefault()}  // ✅ prevent auto-close
      >
        <Command>
          <CommandInput
            placeholder="Search donors..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            {loading ? (
              <div className="p-2 text-sm text-muted-foreground">
                Loading...
              </div>
            ) : donors.length === 0 ? (
              <CommandEmpty>No donors found.</CommandEmpty>
            ) : (
              donors.map((donor) => (
                <CommandItem
                  key={donor.id}
                  value={donor.full_name}
                  onSelect={() => {
                    handleSelect(donor);
                  }}
                >
                  {donor.full_name}
                </CommandItem>
              ))
            )}
          </CommandList>
        </Command>
      </Popover.Content>
    </Popover.Root>
  );
}
