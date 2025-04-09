import { perkIconsMap, perkTextMap } from "./perkMaps";

export default function FormPerks({ perks, setPerks }) {
    const perkNames = ['wifi', 'freeParking', 'tv', 'hotWater', 'pets', 'complFood'];

    function handlePerkChange(e) {
        const { checked, name } = e.target;
        if (checked) {
            setPerks([...perks, name]);
        } else {
            setPerks(perks.filter(perk => perk != name));
        }
    }

    return (
        <div>
            <h2 className="text-2xl mt-4">Perks <span className="text-gray-500 text-sm">(Optional)</span></h2>
            <p className="text-gray-500 text-sm my-1">Select all the perks of your place</p>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2 mt-2">
                {perkNames.length > 0 && perkNames.map((p, index) => (
                    <label key={index} className="flex gap-2 border rounded-2xl p-4 items-center cursor-pointer">
                        <input type="checkbox" onChange={(e) => handlePerkChange(e)} checked={perks.includes(p)} name={p} />
                        {perkIconsMap[p]}
                        <span>{perkTextMap[p]}</span>
                    </label>
                ))}
            </div>
        </div>
    );
}