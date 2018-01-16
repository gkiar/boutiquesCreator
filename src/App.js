import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import { render } from "react-dom";

import Form from "react-jsonschema-form";

//let schema = require("./boutiques");

const schema  = {
  "$schema": "http://json-schema.org/draft-04/schema#",
  "id": "http://github.com/boutiques/boutiques-schema",
  "type": "object",
  "title": "Tool",
  "properties": {
      "name": {
          "id": "http://github.com/boutiques/boutiques-schema/name",
          "minLength": 1,
          "description": "Tool name.",
          "type": "string"
      },
      "tool-version": {
          "id": "http://github.com/boutiques/boutiques-schema/description",
          "minLength": 1,
          "description": "Tool version.",
          "type": "string"
      },
      "description": {
          "id": "http://github.com/boutiques/boutiques-schema/description",
          "minLength": 1,
          "description": "Tool description.",
          "type": "string"
      },
      "command-line": {
          "id": "http://github.com/boutiques/boutiques-schema/command-line",
          "minLength": 1,
          "description": "A string that describes the tool command line, where input and output values are identified by \"keys\". At runtime, command-line keys are substituted with flags and values.",
          "type": "string"
      },
      "container-image": {
          "id": "http://github.com/boutiques/boutiques-schema/container-image",
          "type": "object",
          "allOf": [{
              "properties": {
                  "working-directory": {
                      "id": "http://github.com/boutiques/boutiques-schema/container/working-directory",
                      "minLength": 1,
                      "description": "Location from which this task must be launched within the container.",
                      "type": "string"
                  },
                  "container-hash": {
                      "id": "http://github.com/boutiques/boutiques-schema/container/container-hash",
                      "minLength": 1,
                      "description": "Hash for the given container.",
                      "type": "string"
                  }
              }
          },{
              "oneOf": [{
                  "properties": {
                      "type": { "enum": ["docker", "singularity"] },
                      "image": {
                          "id": "http://github.com/boutiques/boutiques-schema/container/image",
                          "minLength": 1,
                          "description": "Name of an image where the tool is installed and configured. Example: bids/mriqc.",
                          "type": "string"
                      },
                      "entrypoint": {
                        "id": "http://github.com/boutiques/boutiques-schema/container/entrypoint",
                        "description": "Flag indicating whether or not the container uses an entrypoint.",
                        "type": "boolean"
                      },
                      "index": {
                          "id": "http://github.com/boutiques/boutiques-schema/container/index",
                          "minLength": 1,
                          "description": "Optional index where the image is available, if not the standard location. Example: docker.io",
                          "type": "string"
                      },
                      "working-directory": {},
                      "container-hash": {}
                  },
                  "required": ["type", "image"],
                  "additionalProperties": false,
                  "description": "Object representing a docker or singularity container for the tool."
              }, {
                  "properties": {
                      "type": { "enum": ["rootfs"] },
                      "url": {
                          "id": "http://github.com/boutiques/boutiques-schema/container/url",
                          "minLength": 1,
                          "description": "URL where the image is available.",
                          "type": "string"
                      },
                      "working-directory": {},
                      "container-hash": {}
                  },
                  "required": ["type", "url"],
                  "additionalProperties": false,
                  "description": "Object representing a rootfs container for the tool."
              }]
          }],
      },
      "schema-version": {
          "id": "http://github.com/boutiques/boutiques-schema/schema-version",
          "type": "string",
          "description": "Version of the schema used.",
          "enum": ["0.5"]
      },
      "environment-variables": {
          "id": "http://github.com/boutiques/boutiques-schema/environment-variables",
          "type": "array",
          "description": "An array of key-value pairs specifying environment variable names and their values to be used in the execution environment.",
          "items": {
              "id": "http://github.com/boutiques/boutiques-schema/environment-variable",
              "type": "object",
              "properties": {
                  "name": {
                      "id": "http://github.com/boutiques/boutiques-schema/environment-variable/name",
                      "minLength": 1,
                      "description": "The environment variable name (identifier) containing only alphanumeric characters and underscores. Example: \"PROGRAM_PATH\".",
                      "type": "string",
                      "pattern": "^[a-z,A-Z][0-9,_,a-z,A-Z]*$"
                  },
                  "value": {
                      "id": "http://github.com/boutiques/boutiques-schema/environment-variable/value",
                      "description": "The value of the environment variable.",
                      "type": "string"
                  },
                  "description": {
                      "id": "http://github.com/boutiques/boutiques-schema/environment-variable/description",
                      "description": "Description of the environment variable.",
                      "type": "string"
                  }
              },
              "required": [
                  "name",
                  "value"
              ],
              "additionalProperties": false
          }
      },
      "groups": {
          "id": "http://github.com/boutiques/boutiques-schema/groups",
          "description": "Sets of identifiers of inputs, each specifying an input group.",
          "type": "array",
          "items": {
              "id": "http://github.com/boutiques/boutiques-schema/group",
              "type": "object",
              "properties": {
                  "id": {
                      "id": "http://github.com/boutiques/boutiques-schema/group/id",
                      "minLength": 1,
                      "description": "A short, unique, informative identifier containing only alphanumeric characters and underscores. Typically used to generate variable names. Example: \"outfile_group\".",
                      "type": "string",
                      "pattern": "^[0-9,_,a-z,A-Z]*$"
                  },
                  "name": {
                      "id": "http://github.com/boutiques/boutiques-schema/group/name",
                      "minLength": 1,
                      "description": "A human-readable name for the input group.",
                      "type": "string"
                  },
                  "description": {
                      "id": "http://github.com/boutiques/boutiques-schema/group/description",
                      "description": "Description of the input group.",
                      "type": "string"
                  },
                  "members": {
                      "id": "http://github.com/boutiques/boutiques-schema/group/members",
                      "description": "IDs of the inputs belonging to this group.",
                      "type": "array",
                      "items": {
                          "type": "string",
                          "minLength": 1,
                          "pattern": "^[0-9,_,a-z,A-Z]*$"
                      }
                  },
                  "mutually-exclusive": {
                      "id": "http://github.com/boutiques/boutiques-schema/group/mutually-exclusive",
                      "description": "True if only one input in the group may be active at runtime.",
                      "type": "boolean"
                  },
                  "one-is-required": {
                      "id": "http://github.com/boutiques/boutiques-schema/group/one-is-required",
                      "description": "True if at least one of the inputs in the group must be active at runtime.",
                      "type": "boolean"
                  },
                  "all-or-none": {
                      "id": "http://github.com/boutiques/boutiques-schema/group/all-or-none",
                      "description": "True if members of the group need to be toggled together",
                      "type": "boolean"
                  }
              },
              "required": [
                  "name",
                  "id",
                  "members"
              ],
              "additionalProperties": false
          }
      },
      "inputs": {
          "id": "http://github.com/boutiques/boutiques-schema/inputs",
          "type": "array",
          "items": {
              "id": "http://github.com/boutiques/boutiques-schema/input",
              "type": "object",
              "properties": {
                  "id": {
                      "id": "http://github.com/boutiques/boutiques-schema/input/id",
                      "minLength": 1,
                      "description": "A short, unique, informative identifier containing only alphanumeric characters and underscores. Typically used to generate variable names. Example: \"data_file\".",
                      "type": "string",
                      "pattern": "^[0-9,_,a-z,A-Z]*$"
                  },
                  "name": {
                      "id": "http://github.com/boutiques/boutiques-schema/input/name",
                      "minLength": 1,
                      "description": "A human-readable input name. Example: 'Data file'.",
                      "type": "string"
                  },
                  "type": {
                      "id": "http://github.com/boutiques/boutiques-schema/input/type",
                      "type": "string",
                      "description": "Input type.",
                      "enum": ["String", "File", "Flag", "Number"]
                  },
                  "description": {
                      "id": "http://github.com/boutiques/boutiques-schema/input/description",
                      "description": "Input description.",
                      "type": "string"
                  },
                  "value-key": {
                      "id": "http://github.com/boutiques/boutiques-schema/input/value-key",
                      "description": "A string contained in command-line, substituted by the input value and/or flag at runtime.",
                      "type": "string"
                  },
                  "list": {
                      "id": "http://github.com/boutiques/boutiques-schema/input/list",
                      "description":"True if input is a list of value. An input of type \"Flag\" cannot be a list.",
                      "type": "boolean"
                  },
                  "optional": {
                      "id": "http://github.com/boutiques/boutiques-schema/input/optional",
                      "description": "True if input is optional.",
                      "type": "boolean"
                  },
                  "command-line-flag": {
                      "id": "http://github.com/boutiques/boutiques-schema/input/command-line-flag",
                      "description": "Option flag of the input, involved in the value-key substitution. Inputs of type \"Flag\" have to have a command-line flag. Examples: -v, --force.",
                      "type": "string"
                  },
                  "requires-inputs": {
                      "id": "http://github.com/boutiques/boutiques-schema/output/required-inputs",
                      "description": "Ids of the inputs which must be active for this input to be available.",
                      "type": "array",
                      "items": {
                          "type": "string"
                      }
                  },
                  "disables-inputs": {
                      "id": "http://github.com/boutiques/boutiques-schema/output/disabled-by-inputs",
                      "description": "Ids of the inputs that are disabled when this input is active.",
                      "type": "array",
                      "items": {
                          "type": "string"
                      }
                  },
                  "command-line-flag-separator": {
                      "id": "http://github.com/boutiques/boutiques-schema/input/command-line-flag-separator",
                      "description": "Separator used between flags and their arguments. Defaults to a single space.",
                      "type": "string"
                  },
                  "default-value": {
                      "id": "http://github.com/boutiques/boutiques-schema/input/default-value",
                      "description": "Default value of the input, used by the tool when no option is specified."
                  },
                  "value-choices": {
                      "id": "http://github.com/boutiques/boutiques-schema/input/value-choices",
                      "description": "Permitted choices for input value. May not be used with the Flag type.",
                      "type": "array",
                      "items": {
                          "oneOf":  [
                              { "type": "string" },
                              { "type": "number" }
                          ]
                      }
                  },
                  "integer": {
                      "id": "http://github.com/boutiques/boutiques-schema/input/integer",
                      "description": "Specify whether the input should be an integer. May only be used with Number type inputs.",
                      "type": "boolean"
                  },
                  "minimum": {
                      "id": "http://github.com/boutiques/boutiques-schema/input/minimum",
                      "description": "Specify the minimum value of the input (inclusive). May only be used with Number type inputs.",
                      "type": "number"
                  },
                  "maximum": {
                      "id": "http://github.com/boutiques/boutiques-schema/input/maximum",
                      "description": "Specify the maximum value of the input (inclusive). May only be used with Number type inputs.",
                      "type": "number"
                  },
                  "exclusive-minimum": {
                      "id": "http://github.com/boutiques/boutiques-schema/input/exclusive-minimum",
                      "description": "Specify whether the minimum is exclusive or not. May only be used with Number type inputs.",
                      "type": "boolean"
                  },
                  "exclusive-maximum": {
                      "id": "http://github.com/boutiques/boutiques-schema/input/exclusive-maximum",
                      "description": "Specify whether the maximum is exclusive or not. May only be used with Number type inputs.",
                      "type": "boolean"
                  },
                  "min-list-entries": {
                      "id": "http://github.com/boutiques/boutiques-schema/input/min-list-entries",
                      "description": "Specify the minimum number of entries in the list. May only be used with List type inputs.",
                      "type": "number"
                  },
                  "max-list-entries": {
                      "id": "http://github.com/boutiques/boutiques-schema/input/max-list-entries",
                      "description": "Specify the maximum number of entries in the list. May only be used with List type inputs.",
                      "type": "number"
                  },
                  "uses-absolute-path": {
                      "id": "http://github.com/boutiques/boutiques-schema/input/uses-absolute-path",
                      "description": "Specifies that this input must be given as an absolute path. Only specifiable for File type inputs.",
                      "type": "boolean"
                  }
              },
              "required": [
                  "name",
                  "id",
                  "type"
              ],
              "anyOf": [{
                  "properties": {
                      "type": { "enum": ["Flag"] },
                      "list": { "enum": [false] }
                  }
              }, {
                  "properties": {
                      "type": { "enum": ["String", "File", "Number"] }
                  }
              }],
              "dependencies": {
                  "command-line-flag-separator": ["command-line-flag"],
                  "min-list-entries": ["list"],
                  "max-list-entries": ["list"],
                  "value-choices": {
                      "properties": {
                          "type": {"enum": ["String", "Number"]}
                      }
                  },
                  "integer": {
                      "properties": {
                          "type": {"enum": ["Number"]}
                      }
                  },
                  "minimum": {
                      "properties": {
                          "type": {"enum": ["Number"]}
                      }
                  },
                  "maximum": {
                      "properties": {
                          "type": {"enum": ["Number"]}
                      }
                  },
                  "exclusive-minimum": {
                      "properties": {
                          "type": {"enum": ["Number"]}
                      }
                  },
                  "exclusive-maximum": {
                      "properties": {
                          "type": {"enum": ["Number"]}
                      }
                  },
                  "uses-absolute-path": {
                      "properties": {
                          "type": {"enum": ["File"]}
                      }
                  },
                  "exclusive-minimum": ["minimum"],
                  "exclusive-maximum": ["maximum"]
              },
              "additionalProperties": false
          }
      },
      "output-files": {
          "id": "http://github.com/boutiques/boutiques-schema/output-files",
          "type": "array",
          "items": {
              "id": "http://github.com/boutiques/boutiques-schema/output",
              "type": "object",
              "properties": {
                  "id": {
                      "id": "http://github.com/boutiques/boutiques-schema/output/id",
                      "minLength": 1,
                      "description": "A short, unique, informative identifier containing only alphanumeric characters and underscores. Typically used to generate variable names. Example: \"data_file\"",
                      "pattern": "^[0-9,_,a-z,A-Z]*$",
                      "type": "string"
                  },
                  "name": {
                      "id": "http://github.com/boutiques/boutiques-schema/output/name",
                      "description": "A human-readable output name. Example: 'Data file'",
                      "minLength": 1,
                      "type": "string"
                  },
                  "description": {
                      "id": "http://github.com/boutiques/boutiques-schema/output/description",
                      "description": "Output description.",
                      "type": "string"
                  },
                  "value-key": {
                      "id": "http://github.com/boutiques/boutiques-schema/output/value-key",
                      "description": "A string contained in command-line, substituted by the output value and/or flag at runtime.",
                      "type": "string"
                  },
                  "path-template": {
                      "id": "http://github.com/boutiques/boutiques-schema/output/path-template",
                      "description": "Describes the output file path relatively to the execution directory. May contain input value keys. Example: \"results/[INPUT1]_brain.mnc\".",
                      "minLength": 1,
                      "type": "string"
                  },
                  "path-template-stripped-extensions": {
                      "id": "http://github.com/boutiques/boutiques-schema/output/path-template-stripped-extensions",
                      "description": "List of file extensions that will be stripped from the input values before being substituted in the path template. Example: [\".nii\",\".nii.gz\"].",
                      "type": "array",
                      "items": {
                          "type": "string"
                      }
                  },
                  "list": {
                      "id": "http://github.com/boutiques/boutiques-schema/output/list",
                      "description": "True if output is a list of value.",
                      "type": "boolean"
                  },
                  "optional": {
                      "id": "http://github.com/boutiques/boutiques-schema/output/optional",
                      "description": "True if output may not be produced by the tool.",
                      "type": "boolean"
                  },
                  "command-line-flag": {
                      "id": "http://github.com/boutiques/boutiques-schema/output/command-line-flag",
                      "description": "Option flag of the output, involved in the value-key substitution. Examples: -o, --output",
                      "type": "string"
                  },
                  "command-line-flag-separator": {
                      "id": "http://github.com/boutiques/boutiques-schema/output/command-line-flag-separator",
                      "description": "Separator used between flags and their arguments. Defaults to a single space.",
                      "type": "string"
                  },
                  "uses-absolute-path": {
                      "id": "http://github.com/boutiques/boutiques-schema/output-files/uses-absolute-path",
                      "description": "Specifies that this output filepath will be given as an absolute path.",
                      "type": "boolean"
                  },
                  "file-template": {
                      "id": "http://github.com/boutiques/boutiques-schema/input/file-template",
                      "description": "An array of strings that may contain value keys. Each item will be a line in the configuration file.",
                      "type": "array",
                      "minItems": 1,
                      "items": { "type": "string" }
                  }

              },
              "required": [
                  "id",
                  "name",
                  "path-template"
              ],
              "anyOf": [{
                  "properties": {
                      "file-template": {
                          "type": "array",
                          "minItems": 1,
                          "items": { "type": "string" }
                      },
                      "list": { "enum": [false] }
                  }
              }, {
                  "properties": {
                      "file-template": { "enum": [false]} }
              }
                       ],
              "dependencies": {
                  "command-line-flag-separator": ["command-line-flag"]
              },
              "additionalProperties": false
          }
      },
      "invocation-schema": {
          "id": "http://github.com/boutiques/boutiques-schema/invocation-schema",
          "type": "object"
      },
      "suggested-resources": {
          "id": "http://github.com/boutiques/boutiques-schema/suggested-resources",
          "type": "object",
          "properties": {
              "cpu-cores": {
                  "id": "http://github.com/boutiques/boutiques-schema/suggested-resources/cpu-cores",
                  "description": "The requested number of cpu cores to run the described application",
                  "type": "integer",
                  "minimum": 1
              },
              "ram": {
                  "id": "http://github.com/boutiques/boutiques-schema/suggested-resources/ram",
                  "description": "The requested number of GB RAM to run the described application",
                  "type": "number",
                  "minimum": 0
              },
              "disk-space": {
                  "id": "http://github.com/boutiques/boutiques-schema/suggested-resources/disk-space",
                  "description": "The requested number of GB of storage to run the described application",
                  "type": "number",
                  "minimum": 0
              },
              "nodes": {
                  "id": "http://github.com/boutiques/boutiques-schema/suggested-resources/nodes",
                  "description": "The requested number of nodes to spread the described application across",
                  "type": "integer",
                  "minimum": 1
              },
               "walltime-estimate": {
                   "id": "http://github.com/boutiques/boutiques-schema/suggested-resources/walltime-estimate",
                   "type": "number",
                   "description": "Estimated wall time of a task in seconds.",
                   "minimum": 0
               }
          }
      },
      "custom": {
          "id": "http://github.com/boutiques/boutiques-schema/custom",
          "type": "object"
      },
  },
  "required": [
      "name",
      "description",
      "command-line",
      "schema-version",
      "inputs",
      "output-files",
      "tool-version"
  ],
  "additionalProperties": false,
}



const log = (type) => console.log.bind(console, type);


class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Boutiques</h1>
        </header>
        <p className="App-intro">
          Edit your boutiques <code>.json</code>
        </p>
        <div className="container">
          <Form schema={schema}
                onChange={log("changed")}
                onSubmit={log("submitted")}
                onError={log("errors")} />
        </div>
      </div>
    );
  }
}

export default App;
