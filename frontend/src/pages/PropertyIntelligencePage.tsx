import React, { useEffect, useState } from 'react';
import { Building, MapPin, Layers, CheckCircle2, AlertCircle } from 'lucide-react';
import { policyApi } from '../services/api';
import { PolicyDetail, PolicySummary } from '../types';

export const PropertyIntelligencePage: React.FC = () => {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProperties = async () => {
      try {
        setLoading(true);
        const policyList = await policyApi.getPolicies();
        const details = await Promise.all(
          policyList.map((p) => policyApi.getPolicyDetail(p.id))
        );
        const props = details.map((d) => ({
          ...d.property,
          policyNumber: d.policyNumber,
          policyId: d.id,
          policyholderName: d.policyholderName
        }));
        setProperties(props);
      } catch (err) {
        console.error('Failed to load properties:', err);
      } finally {
        setLoading(false);
      }
    };
    loadProperties();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Property Intelligence & Spatial Characteristics</h1>
        <p className="text-xs text-slate-500 mt-1">
          Catalog of insured residential dwellings across Tamil Nadu with structural typology, footprints, and built-up metrics
        </p>
      </div>

      {/* Property Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {properties.map((p) => (
          <div key={p.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                  {p.propertyCode}
                </span>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {p.landUseType}
                </span>
              </div>

              <h2 className="text-sm font-bold text-slate-900">{p.addressLine1}</h2>
              <div className="text-xs text-slate-500 flex items-center space-x-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{p.city}, {p.district} - {p.postalCode}</span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Typology</span>
                  <span className="font-bold text-slate-900">{p.constructionType}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Storeys / Built</span>
                  <span className="font-bold text-slate-900">{p.numberOfFloors} Flr ({p.yearBuilt})</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Total Built-Up</span>
                  <span className="font-bold text-slate-900">{p.builtUpAreaSqm} sqm</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Footprint</span>
                  <span className="font-bold text-slate-900">{p.groundFootprintSqm} sqm</span>
                </div>
              </div>

              {p.hasRecentRenovation && (
                <div className="mt-3 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                  <span className="font-bold block">Renovation Declared:</span>
                  <p className="text-[11px] mt-0.5">{p.renovationDetails}</p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">
                Insured: <span className="font-semibold text-slate-800">{p.policyholderName}</span>
              </span>
              <a
                href={`/policies/${p.policyId}`}
                className="font-semibold text-sky-600 hover:underline"
              >
                View Policy &rarr;
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
