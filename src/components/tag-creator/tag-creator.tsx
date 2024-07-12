import {
  deleteTag,
  getTagsForSubaccount,
  saveActivityLogsNotification,
  upsertTag,
} from "@/lib/queries";
import { Tag } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "../ui/use-toast";
import { v4 } from "uuid";

interface TagCreatorProps {
  subaccountId: string;
  getSelectedTags: (tags: Tag[]) => void;
  defaultTags?: Tag[];
}

const TagColors = ["BLUE", "ORANGE", "ROSE", "PURPLE", "GREEN"] as const;
export type TagColor = (typeof TagColors)[number];

const TagCreator = ({
  subaccountId,
  getSelectedTags,
  defaultTags,
}: TagCreatorProps) => {
  const [selectedTags, setSelectedTags] = useState<Tag[]>(defaultTags || []);
  const [tags, setTags] = useState<Tag[]>([]);
  const router = useRouter();
  const [value, setValue] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  useEffect(() => {
    getSelectedTags(selectedTags);
  }, [selectedTags]);

  useEffect(() => {
    if (subaccountId) {
      const fetchData = async () => {
        const response = await getTagsForSubaccount(subaccountId);
        if (response) setTags(response.Tags);
      };
      fetchData();
    }
  }, [subaccountId]);

  const handleDeleteSelection = (tagId: string) => {
    setSelectedTags(selectedTags.filter((tag) => tag.id !== tagId));
  };

  const handleAddTag = async () => {
    if (!value) {
      toast({
        variant: "destructive",
        title: "Tags need to have a name",
      });
      return;
    }
    if (!selectedColor) {
      toast({
        variant: "destructive",
        title: "Please Select a color",
      });
      return;
    }

    const tagData: Tag = {
      color: selectedColor,
      createdAt: new Date(),
      id: v4(),
      name: value,
      subAccountId: subaccountId,
      updatedAt: new Date(),
    };

    setTags([...tags, tagData]);
    setValue("");
    setSelectedColor("");

    try {
      const response = await upsertTag(subaccountId, tagData);

      toast({
        title: "Created the tag",
      });

      await saveActivityLogsNotification({
        agencyId: undefined,
        description: `Updated a tag | ${response?.name}`,
        subaccountId,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Could not create tag",
      });
    }
  };

  const handleAddSelection = (tag: Tag) => {
    if (selectedTags.every((t) => t.id !== tag.id)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleDeleteTag = async (tagId: string) => {
    setTags(tags.filter((tag) => tag.id !== tagId));
    try {
      const response = await deleteTag(tagId);
      toast({
        title: "Deleted tag",
        description: "The tag is deleted from your subaccount.",
      });

      await saveActivityLogsNotification({
        agencyId: undefined,
        description: `Deleted a tag | ${response?.name}`,
        subaccountId,
      });

      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Could not delete tag",
      });
    }
  };

  return <div>TagCreator</div>;
};

export default TagCreator;
