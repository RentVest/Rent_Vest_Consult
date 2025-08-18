'use client';

// React and Google Maps imports
import { useEffect, useRef } from 'react';
import { useMapsLibrary } from '@vis.gl/react-google-maps';

// Styles
import './LocationAutocomplete.scss';

// Types and interfaces
interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

interface Place {
  geometry: {
    location: {
      lat: () => number;
      lng: () => number;
    };
  };
  address_components: AddressComponent[];
  formatted_address: string;
}

interface LocationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onPlaceSelect?: (place: Place) => void;
  placeholder?: string;
  className?: string;
  id?: string;
  name?: string;
}

// Address Autocomplete Component (similar to the original Location.tsx)
export function AddressAutocomplete({ onPlaceSelect, value, onChange, className, id, name }: LocationAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const places = useMapsLibrary('places');

  useEffect(() => {
    if (!places || !inputRef.current) return;

    const autocomplete = new places.Autocomplete(inputRef.current, {
      types: ['(cities)'],
      componentRestrictions: { country: ['us', 'ca'] },
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace() as Place;
      if (place.formatted_address) {
        onChange(place.formatted_address);
      }
      if (onPlaceSelect) {
        onPlaceSelect(place);
      }
    });
  }, [places, onPlaceSelect, onChange]);

  return (
    <div>
      <input
        ref={inputRef}
        id={id}
        name={name}
        type='text'
        placeholder='Enter location'
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`input-field location-autocomplete ${className || ''}`.trim()}
      />
      <div className='pac-autocomplete'></div>
    </div>
  );
}

// // Main exported component with API provider wrapper
// export default function LocationAutocomplete(props: LocationAutocompleteProps) {
//   if (!API_KEY) {
//     // Fallback to regular input if no API key
//     return (
//       <input
//         id={props.id || 'location'}
//         name={props.name || 'location'}
//         type='text'
//         placeholder={props.placeholder || 'Enter location'}
//         value={props.value}
//         onChange={(e) => props.onChange(e.target.value)}
//         className={`input-field location-autocomplete ${props.className || ''}`.trim()}
//       />
//     );
//   }

//   return (
//     <div className='location-autocomplete-container'>
//       <APIProvider apiKey={API_KEY}>
//         <AddressAutocomplete {...props} />
//       </APIProvider>
//     </div>
//   );
// }

// // Named export for direct use with APIProvider (as used in Step2Component)
// export function LocationAutocompleteInput({ value, onChange, placeholder, className }: LocationAutocompleteProps) {
//   const inputRef = useRef<HTMLInputElement>(null);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const places = useMapsLibrary('places');

//   useEffect(() => {
//     if (!places || !inputRef.current) return;

//     const autocomplete = new places.Autocomplete(inputRef.current, {
//       types: ['(cities)'],
//       componentRestrictions: { country: ['us', 'ca'] },
//     });

//     autocomplete.addListener('place_changed', () => {
//       const place = autocomplete.getPlace() as Place;
//       if (place.formatted_address) {
//         onChange(place.formatted_address);
//       }
//     });

//     // Position the dropdown relative to the input
//     const positionDropdown = () => {
//       const pacContainer = document.querySelector('.pac-container') as HTMLElement;
//       const input = inputRef.current;

//       if (pacContainer && input) {
//         const inputRect = input.getBoundingClientRect();

//         // Position the dropdown
//         pacContainer.style.position = 'absolute';
//         pacContainer.style.top = `${inputRect.height + 4}px`;
//         pacContainer.style.left = '0px';
//         pacContainer.style.width = `${inputRect.width}px`;
//         pacContainer.style.zIndex = '9999';
//       }
//     };

//     // Position on focus and input events
//     const handleFocus = () => {
//       setTimeout(positionDropdown, 100);
//     };

//     const handleInput = () => {
//       setTimeout(positionDropdown, 100);
//     };

//     const currentInput = inputRef.current;
//     if (currentInput) {
//       currentInput.addEventListener('focus', handleFocus);
//       currentInput.addEventListener('input', handleInput);
//     }

//     // Cleanup
//     return () => {
//       if (currentInput) {
//         currentInput.removeEventListener('focus', handleFocus);
//         currentInput.removeEventListener('input', handleInput);
//       }
//     };
//   }, [places, onChange]);

//   return (
//     <APIProvider apiKey={API_KEY}>
//       <AddressAutocomplete value={value} onChange={onChange} placeholder={placeholder} className={className} />
//     </APIProvider>
//   );
// }
