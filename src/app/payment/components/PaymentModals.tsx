'use client';

import { useRouter } from 'next/navigation';
import SelectGoodTypesModal from '@/components/booking/SelectGoodTypesModal';
import AddressDetailsModal from '@/components/booking/AddressDetailsModal';
import AddGstModal from '@/components/booking/AddGstModal';
import HazardousGoodsModal from '@/components/booking/HazardousGoodsModal';
import type { GoodTypeOption } from '@/data/goodTypes';
import type { SavedLocation, PersonDetails } from '@/types/booking';
import { ROUTES } from '@/lib/constants';

interface PaymentModalsProps {
  showRestrictedList: boolean;
  setShowRestrictedList: (v: boolean) => void;
  showGoodTypesModal: boolean;
  setShowGoodTypesModal: (v: boolean) => void;
  setSelectedGoodType: (g: GoodTypeOption) => void;
  selectedGoodType: GoodTypeOption | null;
  showAddressDetailsModal: boolean;
  setShowAddressDetailsModal: (v: boolean) => void;
  onSwapLocations: () => void;
  pickup: SavedLocation | null;
  drop: SavedLocation | null;
  sender: PersonDetails | null;
  receiver: PersonDetails | null;
  vehicleName: string;
  vehicleSubtitle: string;
  vehicleImage: string;
  /** Food flow: pickup is restaurant — hide pickup edit & swap in address modal */
  fromFood?: boolean;
  showGstModal: boolean;
  setShowGstModal: (v: boolean) => void;
  setGstin: (v: string) => void;
  setBusinessName: (v: string) => void;
  gstin: string;
  businessName: string;
}

export default function PaymentModals(props: PaymentModalsProps) {
  const router = useRouter();
  const returnToPayment = encodeURIComponent(
    props.fromFood
      ? `${ROUTES.PAYMENT}?from=food&openAddressModal=1`
      : `${ROUTES.PAYMENT}?openAddressModal=1`
  );

  return (
    <>
      <HazardousGoodsModal isOpen={props.showRestrictedList} onClose={() => props.setShowRestrictedList(false)} />
      <SelectGoodTypesModal
        isOpen={props.showGoodTypesModal}
        onClose={() => props.setShowGoodTypesModal(false)}
        onProceed={(g) => { props.setSelectedGoodType(g); props.setShowGoodTypesModal(false); }}
        initialSelectedId={props.selectedGoodType?.id ?? null}
      />
      <AddressDetailsModal
        isOpen={props.showAddressDetailsModal}
        onClose={() => props.setShowAddressDetailsModal(false)}
        onEditPickup={
          props.fromFood
            ? undefined
            : () => {
                props.setShowAddressDetailsModal(false);
                router.push(`${ROUTES.PICKUP_LOCATION_EDIT}?type=pickup&returnTo=${returnToPayment}`);
              }
        }
        onEditDrop={() => {
          props.setShowAddressDetailsModal(false);
          router.push(`${ROUTES.PICKUP_LOCATION_EDIT}?type=drop&returnTo=${returnToPayment}`);
        }}
        onSwapLocations={props.fromFood ? undefined : props.onSwapLocations}
        pickupReadOnly={props.fromFood}
        pickup={props.pickup}
        drop={props.drop}
        sender={props.sender}
        receiver={props.receiver}
        vehicleName={props.vehicleName}
        vehicleSubtitle={props.vehicleSubtitle}
        vehicleImage={props.vehicleImage}
      />
      <AddGstModal
        isOpen={props.showGstModal}
        onClose={() => props.setShowGstModal(false)}
        onSave={(gstNumber, name) => {
          props.setGstin(gstNumber);
          props.setBusinessName(name);
          props.setShowGstModal(false);
        }}
        initialGstNumber={props.gstin}
        initialBusinessName={props.businessName}
      />
    </>
  );
}
