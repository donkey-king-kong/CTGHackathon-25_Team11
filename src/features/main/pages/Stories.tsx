import { useState, useEffect } from "react";
import { Input } from "@/shared/components/ui/input";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Search, Heart } from "lucide-react";
import { supabase } from "@/infrastructure/supabase/client";

interface ImpactNote {
  id: string;
  content: string;
  donor_name: string | null;
  beneficiary_name: string | null;
  created_at: string;
}

export default function Stories() {
  const [notes, setNotes] = useState<ImpactNote[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<ImpactNote[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const { data, error } = await supabase
          .from('notes')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        setNotes(data || []);
        setFilteredNotes(data || []);
      } catch (error) {
        console.error('Error fetching notes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredNotes(notes);
    } else {
      const filtered = notes.filter(note => 
        note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (note.donor_name && note.donor_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (note.beneficiary_name && note.beneficiary_name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredNotes(filtered);
    }
  }, [searchQuery, notes]);

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-4 bg-muted rounded w-2/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Impact Stories</h1>
        <p className="text-muted-foreground mb-6">
          Heartfelt messages from the children and communities touched by your generosity
        </p>
        
        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search stories by donor name or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Stories Grid */}
      {filteredNotes.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">
              {searchQuery ? "No stories found matching your search." : "No impact stories yet."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredNotes.map((note) => (
            <Card 
              key={note.id} 
              className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 shadow-sm hover:shadow-md transition-shadow duration-200 min-h-[160px] flex flex-col"
            >
              <CardContent className="p-4 flex-1 flex flex-col">
                <p className="text-sm text-gray-700 flex-1 leading-relaxed mb-3">
                  "{note.content}"
                </p>
                
                <div className="space-y-1 text-xs text-gray-500">
                  {note.beneficiary_name && (
                    <p className="font-medium">— {note.beneficiary_name}</p>
                  )}
                  {note.donor_name && (
                    <p className="italic">For donor: {note.donor_name}</p>
                  )}
                  <p className="text-gray-400">
                    {new Date(note.created_at).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Stats Footer */}
      <div className="mt-12 text-center">
        <Card className="max-w-md mx-auto bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-2">
              {notes.length} Stories Shared
            </h3>
            <p className="text-sm text-muted-foreground">
              Each story represents a life touched by the generosity of our donor community
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}