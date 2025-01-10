import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { VennDiagramData } from '../types';
import { X } from 'lucide-react';

interface VennDiagramProps {
  data: VennDiagramData[];
  width?: number;
  height?: number;
}

export function VennDiagram({ data, width = 600, height = 600 }: VennDiagramProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedGames, setSelectedGames] = useState<{
    title: string;
    games: Array<{id: string; name: string}>;
  } | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    const g = svg.append("g")
      .attr("transform", `translate(${width/2},${height/2})`);

    // Define circles
    const circles = [
      { name: 'CMS', x: -100, y: -50, r: 120 },
      { name: 'Content Hub', x: 100, y: -50, r: 120 },
      { name: 'UPAM', x: 0, y: 100, r: 120 }
    ];

    // Draw circles
    g.selectAll("circle")
      .data(circles)
      .join("circle")
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("r", d => d.r)
      .style("fill", (_, i) => d3.schemeCategory10[i])
      .style("fill-opacity", 0.3)
      .style("stroke", (_, i) => d3.schemeCategory10[i])
      .style("stroke-width", 2);

    // Add labels
    g.selectAll("text.label")
      .data(circles)
      .join("text")
      .attr("class", "label")
      .attr("x", d => d.x)
      .attr("y", d => d.y)
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .style("font-weight", "bold")
      .style("font-size", "14px")
      .text(d => d.name);

    // Add counts and make them interactive
    const addCount = (x: number, y: number, count: number, games: any[], title: string) => {
      const group = g.append("g")
        .attr("transform", `translate(${x},${y})`);

      group.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .style("font-size", "12px")
        .text(count);

      // Add invisible circle for better hover detection
      group.append("circle")
        .attr("r", 15)
        .style("fill", "transparent")
        .style("cursor", "pointer")
        .on("click", (event) => {
          event.stopPropagation(); // Prevent event bubbling
          setSelectedGames({
            title,
            games: games || []
          });
        });
    };

    // Position counts based on data
    const dataMap = new Map(data.map(d => [d.sets.sort().join(','), { size: d.size, games: d.games }]));
    
    // Single sets
    addCount(-100, -90, dataMap.get('CMS')?.size || 0, dataMap.get('CMS')?.games || [], 'CMS Only');
    addCount(100, -90, dataMap.get('Content Hub')?.size || 0, dataMap.get('Content Hub')?.games || [], 'Content Hub Only');
    addCount(0, 140, dataMap.get('UPAM')?.size || 0, dataMap.get('UPAM')?.games || [], 'UPAM Only');

    // Intersections
    addCount(0, -70, dataMap.get('CMS,Content Hub')?.size || 0, dataMap.get('CMS,Content Hub')?.games || [], 'CMS & Content Hub');
    addCount(-50, 50, dataMap.get('CMS,UPAM')?.size || 0, dataMap.get('CMS,UPAM')?.games || [], 'CMS & UPAM');
    addCount(50, 50, dataMap.get('Content Hub,UPAM')?.size || 0, dataMap.get('Content Hub,UPAM')?.games || [], 'Content Hub & UPAM');
    
    // Center (all three)
    addCount(0, 0, dataMap.get('CMS,Content Hub,UPAM')?.size || 0, dataMap.get('CMS,Content Hub,UPAM')?.games || [], 'Present in All Systems');

    // Add click handler to clear selection when clicking outside
    svg.on("click", () => {
      setSelectedGames(null);
    });

  }, [data, width, height]);

  return (
    <div className="flex gap-8">
      <div className="flex-1">
        <svg 
          ref={svgRef}
          className="w-full h-full"
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      </div>
      {selectedGames && (
        <div className="w-80 bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">{selectedGames.title}</h3>
            <button
              onClick={() => setSelectedGames(null)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <div className="overflow-y-auto max-h-[500px]">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {selectedGames.games.map((game, index) => (
                  <tr key={`${selectedGames.title}-${game.id}-${index}`} className="hover:bg-gray-50">
                    <td className="px-3 py-2 text-sm font-medium text-gray-900">{game.id}</td>
                    <td className="px-3 py-2 text-sm text-gray-500">{game.name || '-'}</td>
                  </tr>
                ))}
                {selectedGames.games.length === 0 && (
                  <tr>
                    <td colSpan={2} className="px-3 py-4 text-sm text-gray-500 text-center">
                      No games in this category
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}