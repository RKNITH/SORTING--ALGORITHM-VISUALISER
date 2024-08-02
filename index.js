document.addEventListener("DOMContentLoaded", () => {
    const algorithmSelect = document.getElementById("algorithm");
    const startButton = document.getElementById("start");
    const randomnessButton = document.getElementById("randomness");
    const arrayContainer = document.getElementById("array-container");
    const yearSpan = document.getElementById("year");
    const timeDisplay = document.getElementById("time");

    yearSpan.textContent = new Date().getFullYear();

    let array = [];
    const arraySize = 50;

    function createRandomArray(size) {
        array = Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);
        displayArray();
    }

    function displayArray(sortedIndex = null) {
        arrayContainer.innerHTML = "";
        array.forEach((value, index) => {
            const bar = document.createElement("div");
            bar.style.height = `${value * 3}px`;
            bar.classList.add("bar");
            if (sortedIndex !== null && index <= sortedIndex) {
                bar.classList.add("sorted");
            }
            arrayContainer.appendChild(bar);
        });
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function bubbleSort() {
        for (let i = 0; i < array.length; i++) {
            for (let j = 0; j < array.length - i - 1; j++) {
                if (array[j] > array[j + 1]) {
                    [array[j], array[j + 1]] = [array[j + 1], array[j]];
                    displayArray(array.length - i - 1);
                    await sleep(50);
                }
            }
        }
    }

    async function selectionSort() {
        for (let i = 0; i < array.length; i++) {
            let minIndex = i;
            for (let j = i + 1; j < array.length; j++) {
                if (array[j] < array[minIndex]) {
                    minIndex = j;
                }
            }
            if (minIndex !== i) {
                [array[i], array[minIndex]] = [array[minIndex], array[i]];
                displayArray(i);
                await sleep(50);
            }
        }
    }

    async function insertionSort() {
        for (let i = 1; i < array.length; i++) {
            let key = array[i];
            let j = i - 1;
            while (j >= 0 && array[j] > key) {
                array[j + 1] = array[j];
                j--;
                displayArray(i);
                await sleep(50);
            }
            array[j + 1] = key;
            displayArray(i);
            await sleep(50);
        }
    }

    async function mergeSort(start = 0, end = array.length - 1) {
        if (start >= end) return;

        const mid = Math.floor((start + end) / 2);
        await mergeSort(start, mid);
        await mergeSort(mid + 1, end);
        await merge(start, mid, end);
    }

    async function merge(start, mid, end) {
        const leftArray = array.slice(start, mid + 1);
        const rightArray = array.slice(mid + 1, end + 1);

        let i = 0, j = 0, k = start;
        while (i < leftArray.length && j < rightArray.length) {
            if (leftArray[i] <= rightArray[j]) {
                array[k++] = leftArray[i++];
            } else {
                array[k++] = rightArray[j++];
            }
            displayArray(end);
            await sleep(50);
        }

        while (i < leftArray.length) {
            array[k++] = leftArray[i++];
            displayArray(end);
            await sleep(50);
        }

        while (j < rightArray.length) {
            array[k++] = rightArray[j++];
            displayArray(end);
            await sleep(50);
        }
    }

    async function quickSort(start = 0, end = array.length - 1) {
        if (start >= end) return;

        const index = await partition(start, end);
        await Promise.all([quickSort(start, index - 1), quickSort(index + 1, end)]);
    }

    async function partition(start, end) {
        const pivotValue = array[end];
        let pivotIndex = start;

        for (let i = start; i < end; i++) {
            if (array[i] < pivotValue) {
                [array[i], array[pivotIndex]] = [array[pivotIndex], array[i]];
                pivotIndex++;
                displayArray(end);
                await sleep(50);
            }
        }
        [array[pivotIndex], array[end]] = [array[end], array[pivotIndex]];
        displayArray(end);
        await sleep(50);
        return pivotIndex;
    }

    startButton.addEventListener("click", async () => {
        startButton.disabled = true; // Disable the button to prevent multiple clicks
        timeDisplay.textContent = "";
        const algorithm = algorithmSelect.value;

        const startTime = performance.now();
        switch (algorithm) {
            case "bubble":
                await bubbleSort();
                break;
            case "selection":
                await selectionSort();
                break;
            case "insertion":
                await insertionSort();
                break;
            case "merge":
                await mergeSort();
                break;
            case "quick":
                await quickSort();
                break;
            default:
                break;
        }
        const endTime = performance.now();
        const timeTaken = (endTime - startTime) / 1000; // Convert to seconds
        timeDisplay.textContent = `Time taken: ${timeTaken.toFixed(2)} seconds`;

        // Color all bars as sorted after sorting is complete
        displayArray(array.length - 1);
        startButton.disabled = false; // Re-enable the button after sorting is done
    });

    randomnessButton.addEventListener("click", () => {
        createRandomArray(arraySize);
    });

    createRandomArray(arraySize); // Initial array display
});
