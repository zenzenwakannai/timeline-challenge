import { Timeline } from "./Timeline";

export default function App() {
  return (
    <div className="flex h-dvh flex-col bg-gray-900 text-white">
      <div className="flex-grow p-10">
        <h1 className="mb-4 text-2xl text-gray-50">Phase Timeline Challenge</h1>
        <p className="text-gray-300">
          Please follow the instructions in the README.md.
        </p>
      </div>
      <Timeline />
    </div>
  );
}
