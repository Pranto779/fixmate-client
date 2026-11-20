const NavbarSkeleton = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/70 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">

        {/* Logo Skeleton */}
        <div className="h-9 w-32 animate-pulse rounded-lg bg-gray-200" />

        {/* Desktop Navigation Skeleton */}
        <div className="hidden items-center gap-8 md:flex">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-4 w-16 animate-pulse rounded-md bg-gray-200"
            />
          ))}
        </div>

        {/* Action Buttons Skeleton */}
        <div className="flex items-center gap-3">
          <div className="hidden h-10 w-20 animate-pulse rounded-full bg-gray-200 sm:block" />

          <div className="h-10 w-28 animate-pulse rounded-full bg-gray-200" />

          {/* Avatar Skeleton */}
          <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
        </div>

      </div>
    </header>
  );
};

export default NavbarSkeleton;