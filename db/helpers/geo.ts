import { sql } from "drizzle-orm";
import { customType, CustomTypeValues } from "drizzle-orm/pg-core";

/**
 * Experimental custom type for PostGIS geometry, only supports reads
 */
export const geometry = <
  TType extends GeoJSON.Geometry["type"] = GeoJSON.Geometry["type"],
  T extends CustomTypeValues = CustomTypeValues
>(
  dbName: string,
  fieldConfig?: T["config"] & { type: TType }
) => {
  const type = fieldConfig?.type;
  return customType<{
    data: GeometryTypes[TType];
  }>({
    dataType() {
      return type ? `geometry(${type},4326)` : "geometry";
    },
    toDriver(value) {
      return sql`ST_GeomFromGeoJSON(${JSON.stringify(value)})`;
    },
    fromDriver(value) {
      const val = value as string;

      // Detect if hex string
      if (!val.startsWith("{")) {
        return parseHexToGeometry(val) as GeometryTypes[TType];
      } else {
        try {
          const data = JSON.parse(value as string);

          if (type && data.type !== type) {
            throw new Error(`Expected geometry type ${type}, got ${data.type}`);
          }

          return data as GeometryTypes[TType];
        } catch (e) {
          throw new Error(`Failed to parse geometry`, {
            cause: e,
          });
        }
      }
    },
  })(dbName, fieldConfig);
};

export enum GeometryType {
  Point = 1,
  LineString = 2,
  Polygon = 3,
  MultiPoint = 4,
  MultiLineString = 5,
  MultiPolygon = 6,
  GeometryCollection = 7,
}

export const parseHexToGeometry = (hex: string): GeoJSON.Geometry => {
  try {
    const byteStr = hex.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16));
    if (!byteStr) {
      throw new Error("Failed to convert hex to buffer");
    }

    const uint8Array = new Uint8Array(byteStr);
    const buffer = uint8Array.buffer;

    const dataView = new DataView(buffer);

    let byteOffset = 0;

    const byteOrder = dataView.getUint8(0); // 1 byte
    byteOffset += 1; // Move the byte offset past the byte order field

    const littleEndian = byteOrder === 1;

    let geometryType = dataView.getUint32(1, littleEndian); // 4 bytes
    byteOffset += 4; // Move the byte offset past the geometry type field

    const hasSRID = (geometryType & 0x20000000) > 0; // Check if the SRID flag is set

    let srid;

    if (hasSRID) {
      // If SRID is included, read the SRID
      srid = dataView.getUint32(byteOffset, littleEndian);
      // Set geometry type to the actual type, stripping the SRID flag
      geometryType &= ~0x20000000;
      byteOffset += 4; // Move the byte offset past the SRID field
    }

    const geometry = parseGeometry(
      dataView,
      littleEndian,
      geometryType,
      byteOffset
    );

    return geometry;
  } catch (e) {
    throw e;
  } finally {
  }
};

function readPoint(
  dataView: DataView,
  littleEndian: boolean,
  offset: number
): GeoJSON.Position {
  const x = dataView.getFloat64(offset, littleEndian);
  const y = dataView.getFloat64(offset + 8, littleEndian);
  return [x, y];
}

function readLineString(
  dataView: DataView,
  littleEndian: boolean,
  offset: number
): GeoJSON.Position[] {
  const numPoints = dataView.getUint32(1, littleEndian);
  const points: GeoJSON.Position[] = [];
  for (let i = 0; i < numPoints; i++) {
    const x = dataView.getFloat64(offset, littleEndian);
    const y = dataView.getFloat64(offset + 8, littleEndian);
    points.push([x, y]);
    offset += 16;
  }
  return points;
}

function readPolygon(
  dataView: DataView,
  littleEndian: boolean,
  offset: number
): GeoJSON.Position[][] {
  const numRings = dataView.getUint32(1, littleEndian);
  const rings: GeoJSON.Position[][] = [];
  for (let i = 0; i < numRings; i++) {
    const numPoints = dataView.getUint32(offset, littleEndian);
    offset += 4;
    const points: GeoJSON.Position[] = [];
    for (let j = 0; j < numPoints; j++) {
      const x = dataView.getFloat64(offset, littleEndian);
      const y = dataView.getFloat64(offset + 8, littleEndian);
      points.push([x, y]);
      offset += 16;
    }
    rings.push(points);
  }
  return rings;
}

export const parseGeometry = (
  dataView: DataView,
  littleEndian: boolean,
  type: GeometryType,
  offset: number
): GeoJSON.Geometry => {
  switch (type) {
    case GeometryType.Point:
      return {
        type: "Point",
        coordinates: readPoint(
          dataView,
          littleEndian,
          offset
        ) as GeoJSON.Point["coordinates"],
      };
    case GeometryType.LineString:
      return {
        type: "LineString",
        coordinates: readLineString(
          dataView,
          littleEndian,
          offset
        ) as GeoJSON.LineString["coordinates"],
      };
    case GeometryType.Polygon:
      return {
        type: "Polygon",
        coordinates: readPolygon(
          dataView,
          littleEndian,
          offset
        ) as GeoJSON.Polygon["coordinates"],
      };
    case GeometryType.MultiPoint:
      return {
        type: "MultiPoint",
        coordinates: readLineString(
          dataView,
          littleEndian,
          offset
        ) as GeoJSON.MultiPoint["coordinates"],
      };
    case GeometryType.MultiLineString:
      return {
        type: "MultiLineString",
        coordinates: readPolygon(
          dataView,
          littleEndian,
          offset
        ) as GeoJSON.MultiLineString["coordinates"],
      };
    default:
      throw new Error("Unsupported geometry type");
  }
};

export type GeometryTypes = {
  Point: GeoJSON.Point;
  LineString: GeoJSON.LineString;
  Polygon: GeoJSON.Polygon;
  MultiPoint: GeoJSON.MultiPoint;
  MultiLineString: GeoJSON.MultiLineString;
  MultiPolygon: GeoJSON.MultiPolygon;
  GeometryCollection: GeoJSON.GeometryCollection;
};
