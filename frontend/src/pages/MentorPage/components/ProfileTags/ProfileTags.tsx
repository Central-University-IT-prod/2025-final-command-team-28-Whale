interface ProfileTagsProps {
  tags: string[];
}

export const ProfileTags = ({ tags }: ProfileTagsProps) => {
  if (!tags.length) return null;
  
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-6">
      {tags.map((tag, index) => (
        <TagBadge key={index} tag={tag} />
      ))}
    </div>
  );
};

interface TagBadgeProps {
  tag: string;
}

export const TagBadge = ({ tag }: TagBadgeProps) => {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-pointer">
      {tag}
    </span>
  );
};