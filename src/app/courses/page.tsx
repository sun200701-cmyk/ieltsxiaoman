export default function CoursesPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[1480px] flex-col px-6 py-10 lg:px-10">
      <div className="border-b border-black/8 pb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8d7557]">Courses</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-[#101828]">录播课</h1>
      </div>

      <div className="mt-12 grid gap-6 border-t border-black/8">
        <div className="py-8">
          <p className="text-lg font-medium text-[#101828]">课程内容即将上线</p>
        </div>
      </div>
    </main>
  );
}
