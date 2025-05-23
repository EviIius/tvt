import React, { ReactNode } from 'react';
import PlatformHeader from './PlatformHeader';
import Footer from './Footer';
import Stepper from './Stepper';

interface LayoutProps {
  currentStep: number;
  children: ReactNode;
}

export default function Layout({ currentStep, children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[#f6fafd]">
      <PlatformHeader />
      <main className="flex-1 w-full flex flex-col items-center justify-start px-2 pb-8">
        <h2 className="text-4xl font-bold text-center my-8">Machine Learning Hub</h2>
        <div className="w-full max-w-6xl">
          <Stepper currentStep={currentStep} />
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
