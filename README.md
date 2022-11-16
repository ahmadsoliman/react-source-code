# React Source Code
An NPM package to show off your personal React project code right in the browser!

## How to Use

#### Install

        `npm install react-source-code`

#### Inside your index.js or App.js, add the `SourceCodeDevTools` component:
        
        import { SourceCodeDevTools } from "react-component-source"; 

        const root = ReactDOM.createRoot(document.getElementById("root"));
        root.render(
          <React.StrictMode>
            <App />
            <SourceCodeDevTools />
          </React.StrictMode>
        );

#### Wrap any function component you want to show off with the `withSourceCode HOC(Higher order component):

        import { withSourceCode } from "react-component-source";

        export const CoolComponent = withSourceCode(() {
          return (
            <div>My Cool Component</div>
          );
        });

#### For class components you can wrap the class itself or it's export but you must supply a partial path to the component:

        import { withSourceCode } from "react-component-source";

        class CoolComponent extends React.Component<> {
          render() {
            return (
              <div>My Cool Component</div>
            );
          }
        }

        export default withSourceCode(CoolComponent, "src/component/CoolComponent"); // A path is a must for classes

#### What is this partial path ?

It's a way to identify the component in your project source map files where the original code could be found. You supply it to the `withSourceCode` HOC as an optional second argument. You can even supply the component name only, if it's unique in your project. If at any time your component's code couldn't be found, supply a better path. Or check your bundle tools to make sure you're building source map files.

# Development
You can submit pull requests.

## Features
- [Typescript](https://typescript.com/) strongly typed with typings exported
- [Rollup](https://rollupjs.org/) for build
- Bundle generated in `cjs` and `esm` formats

### Commands
- `npm install` - install project dependencies
- `npm run build` - build package into `dist/` folder
- `npm run publish` - publish your package to [npm](npmjs.com).

### License
MIT license, Copyright (c) Ahmad Soliman. For more information see `LICENSE`.
