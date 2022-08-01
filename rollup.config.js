import commonjs from "@rollup/plugin-commonjs";
import nodeExternals from "rollup-plugin-node-externals";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import esbuild from "rollup-plugin-esbuild";
import json from "@rollup/plugin-json";
import dts from "rollup-plugin-dts";
import path from "path";

/**
 * The target output directory.
 *
 * @type {string}
 */
const outDir = "dist";

/**
 * The name of the project.
 *
 * @type {string}
 */
const name = "remix-extras";

/**
 * Get a base configuration
 *
 * @param {import("rollup").ModuleFormat} type Type to get base for
 * @param {boolean} [toMinify=false] Whether to create minified output
 * @return {import("rollup").RollupOptions}
 */
function getBase(type, toMinify = false) {
    return {
        "input": "src/index.ts",
        "output": {
            "file": `${outDir}/${type}${toMinify ? ".min" : ""}.js`,
            "name": type === "umd" ? name : undefined,
            "format": type
        },
        "plugins": [
            commonjs(),
            nodeExternals(),
            nodeResolve({
                "extensions": [
                    ".ts",
                    ".js"
                ]
            }),
            esbuild({
                "minify": toMinify,
                "sourceMap": false,
                "tsconfig": path.resolve(process.cwd(), "tsconfig.json")
            }),
            json({
                "compact": toMinify
            })
        ]
    };
}

/**
 * Get the config for a build type.
 *
 * @param {import("rollup").ModuleFormat} types Types to build
 * @return {import("rollup").RollupOptions[]}
 */
function getConfig(...types) {
    /**
     * @type {import("rollup").RollupOptions[]}
     */
    const configs = [{
        "input": "build/index.d.ts",
        "output": {
            "file": `${outDir}/index.d.ts`,
            "format": "es"
        },
        "plugins": [
            dts()
        ],
        "external": ["react"]
    }];

    // Generate config for each type
    for (const type of types) {
        configs.push(
            getBase(type),
            getBase(type, true)
        );
    }

    return configs;
}

export default getConfig("cjs", "esm");
