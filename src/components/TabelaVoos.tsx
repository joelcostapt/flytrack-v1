"use client";
import { useState, useEffect } from "react";

interface Flight {
    flight_date: string;
    flight_status: string;
    departure: {
        icao: string;
        terminal: number;
        gate: string;
        delay: number;

    };
    arrival: {
        icao: string;
        baggage: string;
    };
    airline: {
        name: string;
    };
    flight: {
        iata: string;
    };
}

const TabelaVoos = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const res = await fetch(
          "https://api.aviationstack.com/v1/flights?access_key=ba1ac5064caafce02936294b1e9db87a&airline_icao=aea"
        );
        const data = await res.json();
        setFlights(data.data);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredFlights = flights.filter((flight) =>
    flight.flight.iata ? flight.flight.iata.toLowerCase().includes(searchQuery.toLowerCase()) : false
  );
  

  if (loading) return <h1 className="text-white">Carregando...</h1>;

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="max-w-6xl w-full bg-gray-800 p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-white mb-6">Informações de Voos</h1>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Procure pelo número de voo"
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full p-2 rounded bg-gray-700 text-white placeholder-gray-400"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="text-xs uppercase bg-gray-700 text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">Nº Voo</th>
                <th scope="col" className="px-6 py-3">Companhia</th>
                <th scope="col" className="px-6 py-3">Partida</th>
                <th scope="col" className="px-6 py-3">Chegada</th>
                <th scope="col" className="px-6 py-3">Estado</th>
                <th scope="col" className="px-6 py-3">Terminal</th>
                <th scope="col" className="px-6 py-3">Porta</th>
                <th scope="col" className="px-6 py-3">Atraso</th>
                <th scope="col" className="px-6 py-3">Rec. Bagagem</th>
              </tr>
            </thead>
            <tbody>
              {filteredFlights.length > 0 ? (
                filteredFlights.map((flight, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-700 hover:bg-gray-600"
                  >
                    <td className="px-6 py-4  text-center">{flight.flight.iata}</td>
                    <td className="px-6 py-4  text-center">{flight.airline.name}</td>
                    <td className="px-6 py-4  text-center">{flight.departure.icao}</td>
                    <td className="px-6 py-4  text-center">{flight.arrival.icao}</td>
                    <td className="px-6 py-4  text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          flight.flight_status === "scheduled"
                            ? "bg-yellow-600 text-white"
                            : flight.flight_status === "delayed"
                            ? "bg-red-500 text-black"
                            : flight.flight_status === "active"
                            ? "bg-green-600 text-white"
                            : "bg-orange-600 text-white"
                        }`}
                      >
                        {flight.flight_status === "scheduled"
                          ? "Agendado"
                          : flight.flight_status === "active"
                          ? "Ativo"
                          : flight.flight_status === "delayed"
                          ? "Atrasado"
                          : "Aterrou"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">{flight.departure.terminal}</td>
                    <td className="px-6 py-4 text-center">{flight.departure.gate}</td>
                    {flight.departure.delay > 0
                    ? <td className="px-6 py-4 text-center">{flight.departure.delay} min.</td>
                    : <td className="px-6 py-4 text-center"></td>}
                    <td className="px-6 py-4 text-center">{flight.arrival.baggage}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="text-center text-white py-4">
                    Nenhum voo encontrado com esse número.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TabelaVoos;
