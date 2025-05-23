export default function Footer() {
  return (
    <footer className="w-full border-t mt-10 py-4">
      <div className="pl-4 relative">
        <div className="flex flex-row items-center text-sm text-muted-foreground">
          <div>© 2025 LLMX</div>
          <div className="absolute left-1/2 transform -translate-x-1/2 max-w-2xl text-center">
            LLMX applications may produce inaccurate or misleading information about documents, people, places, or facts. Use with caution.
          </div>
        </div>
      </div>
    </footer>
  );
}
