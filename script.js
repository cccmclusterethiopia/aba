document.addEventListener('DOMContentLoaded', () => {
    const regionSelect = document.getElementById('region');
    const zoneSelect = document.getElementById('zone');
    const woredaSelect = document.getElementById('woreda');

    // Helper function to fetch data from PHP scripts
    async function fetchData(url, params = {}) {
        const query = new URLSearchParams(params).toString();
        try {
            const response = await fetch(`${url}?${query}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching data:', error);
            return [];
        }
    }

    // Helper function to populate a dropdown
    function populateDropdown(dropdown, data, defaultOptionText, disableOnReset = []) {
        dropdown.innerHTML = `<option value="">${defaultOptionText}</option>`;
        data.forEach(item => {
            const option = document.createElement('option');
            option.value = item;
            option.textContent = item;
            dropdown.appendChild(option);
        });
        dropdown.disabled = data.length === 0;

        // Disable and reset subsequent dropdowns
        disableOnReset.forEach(d => {
            d.innerHTML = `<option value="">${d.options[0].textContent}</option>`;
            d.disabled = true;
        });
    }

    // Load Regions on page load
    async function loadRegions() {
        const regions = await fetchData('get_regions.php');
        populateDropdown(regionSelect, regions, 'Select Region', [zoneSelect, woredaSelect]);
    }

    // Event listener for Region selection change
    regionSelect.addEventListener('change', async () => {
        const selectedRegion = regionSelect.value;
        if (selectedRegion) {
            const zones = await fetchData('get_zones.php', { region_name: selectedRegion });
            populateDropdown(zoneSelect, zones, 'Select Zone', [woredaSelect]);
        } else {
            // Reset zone and woreda if no region is selected
            populateDropdown(zoneSelect, [], 'Select Zone', [woredaSelect]);
        }
    });

    // Event listener for Zone selection change
    zoneSelect.addEventListener('change', async () => {
        const selectedZone = zoneSelect.value;
        const selectedRegion = regionSelect.value; // Get the selected region too for accurate filtering

        if (selectedZone && selectedRegion) {
            const woredas = await fetchData('get_woredas.php', { region_name: selectedRegion, zone_name: selectedZone });
            populateDropdown(woredaSelect, woredas, 'Select Woreda');
        } else {
            // Reset woreda if no zone is selected
            populateDropdown(woredaSelect, [], 'Select Woreda');
        }
    });

    // Initial load of regions
    loadRegions();
});