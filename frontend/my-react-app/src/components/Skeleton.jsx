export function PostCardSkeleton() {
  return (
    <div className="post skeleton-card">
      <div className="skeleton-block skeleton-img" />
      <div className="body">
        <div className="skeleton-block skeleton-line" style={{ width: "80%" }} />
        <div className="skeleton-block skeleton-line" style={{ width: "40%" }} />
      </div>
    </div>
  );
}

export function AvatarSkeleton() {
  return <div className="skeleton-block skeleton-avatar" />;
}

export function ListRowSkeleton() {
  return (
    <div className="act-row">
      <div className="skeleton-block skeleton-avatar" />
      <div className="skeleton-block skeleton-line" style={{ width: "60%" }} />
    </div>
  );
}