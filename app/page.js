import ObjectDetection from "@/components/objectDetection";

export default function Home() {
  return (
    <main className="p-8 min-h-screen flex flex-col items-center justify-center">
      <h1 className="gradient-title text-3xl font-bold md:text-6xl tracking-tighter md:px-6 text-center">Thief In House? Catch&apos;em</h1>
      <ObjectDetection />
    </main>
  );
}
