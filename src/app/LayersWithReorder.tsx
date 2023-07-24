"use client";
import React from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import { dynamicgeojson, layer } from "./page";
import { ArrowDownToLine, GripVertical, Pipette, Trash } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { HexColorPicker } from "react-colorful";

const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
  padding: 2,
  margin: `5px 0px 0px 0px`,
  background: "white",
  color: "black",
  border: `0.5px solid grey`,
  fontSize: `14px`,
  borderRadius: `5px`,
  minWidth: 100,
  display: "flex",
  alignItems: "center",

  ...draggableStyle,
});

type layerReorderPropType = {
  layers: layer[];
  setLayers: React.Dispatch<React.SetStateAction<layer[]>>;
};

function LayersReorder({ layers, setLayers }: layerReorderPropType) {
  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    const items = Array.from(layers);
    const [newOrder] = items.splice(source.index, 1);
    items.splice(destination.index, 0, newOrder);

    // setTodo(items)
    setLayers(items);
  };

  const onSymbolClick = (layerid: string, type: string) => {
    setLayers([
      ...layers.map((l) => {
        if (l.id === layerid) {
          return {
            ...l,
            containingGeometries: [
              ...l.containingGeometries.map((cg) => {
                if (cg.type === type) {
                  return {
                    ...cg,
                    visibleOnMap: !cg.visibleOnMap,
                  };
                }
                return {
                  ...cg,
                };
              }),
            ],
          };
        }
        return { ...l };
      }),
    ]);
  };

  const downloadGeojson = (geojson: dynamicgeojson, name: string) => {
    var FileSaver = require("file-saver");
    var blob = new Blob([JSON.stringify(geojson)], {
      type: "text/plain;charset=utf-8",
    });
    FileSaver.saveAs(blob, `${name || "osm-gpt-extract"}.geojson`);
  };

  return (
    <div className="LayersReorder">
      {/* <h1>Drag and Drop</h1> */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="todo">
          {(provided) => (
            <div
              className="todo"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {layers.map(
                ({ id, name, color, containingGeometries, geojson }, index) => {
                  const ifhaspoint = containingGeometries.find(
                    (ge) => ge.type === "Point"
                  );
                  const ifhasline = containingGeometries.find(
                    (ge) => ge.type === "Line"
                  );
                  const ifhaspolygon = containingGeometries.find(
                    (ge) => ge.type === "Polygon"
                  );
                  return (
                    <Draggable
                      key={`${id}-${index}`}
                      draggableId={`${id}-${index}`}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}
                        >
                          <GripVertical color="grey" />

                          <Popover>
                            <PopoverTrigger>
                              <Pipette
                                className="mr-1 cursor-pointer"
                                size={15}
                              />
                            </PopoverTrigger>
                            <PopoverContent>
                              <HexColorPicker
                                color={color}
                                onChange={(e) =>
                                  setLayers([
                                    ...layers.map((lyr) => {
                                      if (lyr.id === id) {
                                        return {
                                          ...lyr,
                                          color: e,
                                        };
                                      }
                                      return { ...lyr };
                                    }),
                                  ])
                                }
                              />
                            </PopoverContent>
                          </Popover>

                          {ifhaspoint && (
                            <div
                              style={{
                                width: "15px",
                                height: "15px",
                                borderRadius: "50%",
                                background: color,

                                marginRight: 2,
                                cursor: "pointer",
                                opacity: ifhaspoint?.visibleOnMap ? 1 : 0.2,
                              }}
                              onClick={() => {
                                onSymbolClick(id, "Point");
                              }}
                              tabIndex={0}
                            />
                          )}

                          {/* Slanted Line */}
                          {ifhasline && (
                            <div
                              style={{
                                width: "20px",
                                height: "4px",
                                background: color,
                                transform: "rotate(45deg)",
                                marginRight: 5,
                                cursor: "pointer",
                                opacity: ifhasline?.visibleOnMap ? 1 : 0.2,
                              }}
                              onClick={() => {
                                onSymbolClick(id, "Line");
                              }}
                              tabIndex={0}
                            />
                          )}

                          {ifhaspolygon && (
                            <div
                              style={{
                                width: "15px",
                                height: "15px",
                                background: color,

                                marginRight: 4,
                                cursor: "pointer",
                                opacity: ifhaspolygon?.visibleOnMap ? 1 : 0.2,
                              }}
                              onClick={() => {
                                onSymbolClick(id, "Polygon");
                              }}
                              tabIndex={0}
                            />
                          )}

                          <span className="flex-1 mx-2">{name}</span>

                          <Menubar className="h-4 border-none p-0">
                            <MenubarMenu>
                              <MenubarTrigger className="px-0  py-0">
                                <ArrowDownToLine
                                  className="cursor-pointer "
                                  size={20}
                                />
                              </MenubarTrigger>
                              <MenubarContent>
                                <MenubarItem
                                  onClick={(e: any) => {
                                    downloadGeojson(geojson, name);
                                  }}
                                >
                                  All
                                </MenubarItem>
                                <MenubarSeparator />
                                {ifhaspoint && (
                                  <MenubarItem
                                    onClick={(e: any) => {
                                      downloadGeojson(
                                        geojson?.features?.filter((f: any) =>
                                          ["Point"].includes(f.geometry?.type)
                                        ),
                                        name
                                      );
                                    }}
                                  >
                                    Points
                                  </MenubarItem>
                                )}
                                {ifhasline && (
                                  <MenubarItem
                                    onClick={(e: any) => {
                                      downloadGeojson(
                                        geojson?.features?.filter((f: any) =>
                                          [
                                            "LineString",
                                            "MultiLineString",
                                          ].includes(f.geometry?.type)
                                        ),
                                        name
                                      );
                                    }}
                                  >
                                    Lines
                                  </MenubarItem>
                                )}
                                {ifhaspolygon && (
                                  <MenubarItem
                                    onClick={(e: any) => {
                                      downloadGeojson(
                                        geojson?.features?.filter((f: any) =>
                                          ["Polygon", "MultiPolygon"].includes(
                                            f.geometry?.type
                                          )
                                        ),
                                        name
                                      );
                                    }}
                                  >
                                    Polygons
                                  </MenubarItem>
                                )}
                              </MenubarContent>
                            </MenubarMenu>
                          </Menubar>
                          <Trash
                            className="cursor-pointer "
                            // color="grey"
                            size={15}
                            onClick={() => {
                              setLayers([
                                ...layers.filter((lyr) => lyr.id !== id),
                              ]);
                            }}
                          />
                        </div>
                      )}
                    </Draggable>
                  );
                }
              )}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export default LayersReorder;
