import { CanvasShape } from "~/shape/CanvasShape.ts";
import { useState } from "react";
import deployApi from "~/service/deploy.ts";

type CustomElementProperties = {
  name: string;
};

export type HtmlSemantic = "button" | "div" | "span";

// TODO write a test for this
export const useDeployCustomElement = (
  shape: CanvasShape,
  properties: CustomElementProperties,
) => {
  const [deploying, setDeploying] = useState(false);

  const serialize = (shape: CanvasShape, name: string, classNamePrefix: string, semantic: HtmlSemantic): string => {
    const className = `${classNamePrefix}-${name}`;
    return `
      class ${name} extends HTMLElement {
        connectedCallback() {
          this.innerHTML = '${shape.createStyle(className)} <${
            semantic
          } class="${className}">Click Me</${semantic}>';
      }
    }`;
  };

  const deploy = () => {
    const code = serialize(shape, properties.name, "enesi", "button");
    setDeploying(true);
    deployApi
      .call({
        name: properties.name,
        code,
      })
      .then(() => {
        console.log("deployed");
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        setDeploying(false);
      });
  };

  return {
    deploy,
    deploying,
  };
};
