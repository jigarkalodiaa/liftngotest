'use client';

import { Truck, CheckCircle2 } from 'lucide-react';
import { PRIMARY, VEHICLE_3W_FEATURES, VEHICLE_4W_FEATURES } from './constants';

export function VehicleTypes() {
  return (
    <section className="bg-white">
      <div className="px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-6xl">
          {/* Section Header */}
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider sm:px-4 sm:py-2 sm:text-[11px]" style={{ borderColor: `${PRIMARY}20`, color: PRIMARY }}>
              <Truck className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Vehicle Options
            </span>
            <h2 className="mt-4 text-2xl font-black leading-tight tracking-tight text-gray-900 sm:mt-6 sm:text-3xl md:text-4xl">
              Choose Your Canvas
            </h2>
            <p className="mt-3 text-sm text-gray-500 sm:mt-4 sm:text-base">
              Both run on real Liftngo operations.
            </p>
          </div>

          {/* Vehicle Cards - Symmetric Grid */}
          <div className="mt-10 grid gap-4 sm:mt-12 sm:gap-6 md:grid-cols-2 lg:mt-16">
            {/* 3W Card */}
            <div className="flex flex-col overflow-hidden rounded-2xl border-2 border-emerald-100 bg-gradient-to-br from-emerald-50/50 to-white transition-all hover:border-emerald-200 hover:shadow-lg">
              <div className="flex-1 p-5 sm:p-6">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500 shadow-md sm:h-14 sm:w-14">
                    <Truck className="h-6 w-6 text-white sm:h-7 sm:w-7" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-gray-900 sm:text-xl">3W EV Branding</h3>
                    <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600 sm:text-sm">Nimble · High Frequency</p>
                  </div>
                </div>
                
                <ul className="mt-5 space-y-3 sm:mt-6">
                  {VEHICLE_3W_FEATURES.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500 sm:h-5 sm:w-5" />
                      <span className="text-sm text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 4W Card */}
            <div className="flex flex-col overflow-hidden rounded-2xl border-2 border-violet-100 bg-gradient-to-br from-violet-50/50 to-white transition-all hover:border-violet-200 hover:shadow-lg">
              <div className="flex-1 p-5 sm:p-6">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-600 shadow-md sm:h-14 sm:w-14">
                    <Truck className="h-6 w-6 text-white sm:h-7 sm:w-7" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-gray-900 sm:text-xl">4W Branding</h3>
                    <p className="text-xs font-semibold uppercase tracking-wider text-violet-600 sm:text-sm">Bold Canvas · Full Wrap</p>
                  </div>
                </div>
                
                <ul className="mt-5 space-y-3 sm:mt-6">
                  {VEHICLE_4W_FEATURES.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-violet-500 sm:h-5 sm:w-5" />
                      <span className="text-sm text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
