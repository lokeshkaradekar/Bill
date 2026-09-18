RKK FISH BILL GENERATOR - FIXES

1. Fish name is now one shared field (Fish) and updates everywhere:
   - Header: Fishes : <fish name>
   - Bill To box: Fishes : <fish name>
   - Bill Details table: Fishes (<fish name>)

2. The header artwork no longer contains a baked-in "caffis" label. The name is rendered dynamically by React.

3. The supplied RKK header artwork and wave artwork are included in public/assets so the images do not show as broken-image placeholders.

4. The footer wave artwork no longer contains a duplicate hard-coded contact bar.

5. Default fish-entry Quantity and Rate are 0.

6. Old Balance is optional and blank by default. If left blank, it is hidden from the final bill. Entering 0 or another amount shows it.

7. There is no Sl. No. limit. Add Fish can continue adding rows.

IMPORTANT:
Copy/merge BOTH the src/ and public/assets/ folders into the existing Vite project. If the browser has an older saved bill, click New Bill once or edit the Fish field; the loader also migrates old saved data safely.
