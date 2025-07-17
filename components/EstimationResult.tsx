'use client';

import { FaMoneyBillWave, FaClock, FaMapMarkedAlt, FaBalanceScale, FaHandHoldingUsd } from 'react-icons/fa';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface Props {
  distance: number; // en km
  duration: string; // exemple : "1h 9min 49s"
  estimatedCost: number;
  officialCost: number;
}

export default function EstimationResult({ distance, duration, estimatedCost, officialCost }: Props) {
  const [proposedPrice, setProposedPrice] = useState('');

  const handleSubmit = () => {
    alert(`Prix proposé : ${proposedPrice} FCFA`);
    // Tu peux ajouter ici un appel API ou une redirection vers un formulaire.
  };

  return (
    <div className="bg-[#1B263B] text-white rounded-2xl p-6 shadow-xl w-full max-w-md mx-auto space-y-4">
      
      <div className="flex justify-between items-center border-b border-gray-700 pb-4">
        <div className="flex items-center gap-2 text-lg">
          <FaMapMarkedAlt className="text-blue-400" />
          Distance :
        </div>
        <div className="font-bold text-xl">{distance.toFixed(1)} km</div>
      </div>

      <div className="flex justify-between items-center border-b border-gray-700 pb-4">
        <div className="flex items-center gap-2 text-lg">
          <FaClock className="text-yellow-400" />
          Durée :
        </div>
        <div className="font-bold text-xl">{duration}</div>
      </div>

      <div className="flex justify-between items-center border-b border-gray-700 pb-4">
        <div className="flex items-center gap-2 text-lg">
          <FaMoneyBillWave className="text-green-400" />
          Notre Estimation :
        </div>
        <div className="text-orange-400 font-extrabold text-2xl">{estimatedCost.toFixed(1)} FCFA</div>
      </div>

      <div className="flex justify-between items-center border-b border-gray-700 pb-4">
        <div className="flex items-center gap-2 text-lg">
          <FaBalanceScale className="text-gray-400" />
          Tarif Officiel :
        </div>
        <div className="font-bold text-xl text-gray-300">{officialCost.toFixed(1)} FCFA</div>
      </div>

      <div className="mt-6 bg-[#0D1B2A] p-4 rounded-xl border border-orange-500">
        <div className="flex items-center gap-2 mb-2 text-orange-400 font-medium">
          <FaHandHoldingUsd />
          Proposez votre prix
        </div>

        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Ex: 350"
            value={proposedPrice}
            onChange={(e) => setProposedPrice(e.target.value)}
            className="bg-gray-800 border border-orange-400 text-white rounded-lg px-4 py-2 w-full"
          />
          <Button
            onClick={handleSubmit}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg"
          >
            Continuer
          </Button>
        </div>
      </div>
    </div>
  );
}
