'use client'
import React, { useState } from 'react';
import {black} from "next/dist/lib/picocolors";
import Card from "@/app/ui/Card";
import Modal from "@/app/ui/modal";
import Link from "next/link";
import {list} from "postcss";
import {event} from "next/dist/build/output/log";

interface Input {
    key: string;
    value: string;
    results : Location []
    selected : Location
}

interface Location {
    lon: string;
    lat: string;
    display_name:string;
}


export default function DynamicForm() {
    //TODO check this
    const [inputs, setInputs] = useState<Input[]>([{ key: '', value: '',results : [],selected: {lon:'',lat:'',display_name:''} }]);
    const [midPoint,setMidPoint] = useState<Location>({lat:'',lon:'',display_name:''})
    const handleInputChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        console.log(value)
        const list = [...inputs];
        list[index].value = value;
        //TODO aqui se puede agregar el autocompletar
        setInputs(list);
    };

    const handleAddClick = () => {
        setInputs([...inputs, { key: '', value: '' ,results:[],selected: {lon:'',lat:'',display_name:''}}]);
    };

    const handleSelectionOption = (loc:Location,index:number) => {
        const list = [...inputs];
        list[index].selected = loc;
        list[index].value = loc.display_name;
        setInputs(list);
    };

    const handleSearchClick = async (index:number) => {

            let value = inputs[index].value;
            //TODO move baseUrl and key to env.local
            const baseUrl = 'https://us1.locationiq.com/v1/search';
            const queryParams = new URLSearchParams({
                q: value,
                format: 'json',
                key: `${process.env.LOCATION_KEY}`
            });

            const url = `${baseUrl}?${queryParams}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch location data');
            }

            const data = await response.json();
            const list = [...inputs];
            list[index].results = [...data];
            setInputs(list);

    };

    const handleRemoveClick = (index: number) => {
        const list = [...inputs];
        list.splice(index, 1);
        setInputs(list);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log('Form submitted:', inputs);
        const locations: Location[] = []
        inputs.map((input, index) => {
            locations.push(input.selected)
        })
        await calculateCentralPoint(locations)

    };

    async function calculateCentralPoint(locations :Location []) {
        let totalLat = 0;
        let totalLon = 0;

        // Sum up all latitudes and longitudes
        for (let i = 0; i < locations.length; i++) {
            totalLat += parseFloat(locations[i].lat); // Latitude
            totalLon += parseFloat(locations[i].lon); // Longitude
        }

        // Calculate the average latitude and longitude
        const averageLat: number = totalLat / locations.length;
        const averageLon: number = totalLon / locations.length;

        //setMidPoint({lat:${averageLon},lon:`${averageLon}`})

        const key = `${process.env.LOCATION_KEY}`

        const baseUrl =` https://us1.locationiq.com/v1/reverse?key=${key}&lat=${averageLat}&lon=${averageLon}&format=json`;
        const response = await fetch(baseUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to perform reverse geocoding');
        }

        const data = await response.json();
        console.log(data)
        setMidPoint(data)
    }

    return (
        <>
            <Card title={"Punto medio"} value={"Agrega hasta 5 direcciones"}>
                <form onSubmit={handleSubmit} className={"max-w-xl mx-auto mt-8"}>
                    {inputs.map((input, i) => (
                        <div key={i} className="flex items-center">
                            <label>
                                Address {i + 1}
                            </label>
                            <span className={"pr-5"}></span>
                            <input
                                name='value'
                                value={input.value}
                                onChange={(event) => handleInputChange(i, event)}
                                placeholder='Value'
                                color="#FFFFF"
                                className={"px-4 py-2 border border-gray-300 rounded-r mr-2 focus:outline-none focus:border-blue-500"}
                            />

                            <button type="button" onClick={ async () => {
                                await handleSearchClick(i)
                            }}
                                    className={"px-4 py-2 bg-green-500 text-white rounded-l-none border border-green-500 hover:bg-green-600 focus:outline-none focus:border-green-700"}>Search
                            </button>
                            {inputs[i].results.length > 0 && inputs[i].selected.lat === '' && (
                                <Modal title={"Selecciona solo uno"}>
                                    <ul>
                                         {
                                                 inputs[i].results.map((loc,index) =>
                                                 (
                                                    <li key={loc.display_name}>
                                                        <Link href={"/"} onClick={() => {
                                                            handleSelectionOption(loc,i)
                                                        }}>
                                                            {loc.display_name}
                                                        </Link>

                                                    </li>

                                                 )
                                                 )

                                        }
                                    </ul>

                                </Modal>
                            )}
                            {inputs.length !== 1 && (
                                <button type="button" onClick={() => handleRemoveClick(i)}
                                        className={"px-4 py-2 bg-red-500 text-white rounded-l-none border border-red-500 hover:bg-red-600 focus:outline-none focus:border-red-700"}>-</button>
                            )}

                            {inputs.length - 1 === i && i < 4 && inputs[i].selected.lat !== '' &&(
                                <button type="button" onClick={handleAddClick}
                                        className={"px-4 py-2 bg-blue-500 text-white rounded-r-none border border-blue-500 hover:bg-blue-600 focus:outline-none focus:border-blue-700"}>+</button>
                            )}
                        </div>
                    ))}
                    <button type='submit' className={
                        inputs.length < 2 ? "px-4 py-2 bg-gray-500 text-black rounded mt-4" :
                            "px-4 py-2 bg-green-500 text-white rounded mt-4"
                    }
                        disabled={inputs.length < 2 }
                    >Submit</button>
                </form>
            </Card>
            <Card title={"Punto medio"}>
                <h1>{midPoint.display_name}</h1>
            </Card>
        </>
    );
}
