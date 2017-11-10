import { expect } from 'chai';
import Inferno from 'inferno';
import Component from 'inferno-component';
import {
  spaces,
  indent,
  debugNode,
  debugNodes,
} from 'enzyme/build/Debug';
import { mount, shallow } from 'enzyme';

import InfernoEnzymeAdapter from '../../src/InfernoEnzymeAdapter';

const adapter = new InfernoEnzymeAdapter();

const debugElement = element => debugNode(adapter.elementToNode(element));

describe('debug', () => {
  describe('spaces(n)', () => {
    it('should return n spaces', () => {
      expect(spaces(4)).to.equal('    ');
      expect(spaces(2)).to.equal('  ');
      expect(spaces(0)).to.equal('');
    });
  });

  describe('indent(depth, string)', () => {
    it('should indent a single-line string by (n) spaces', () => {
      expect(indent(4, 'hello')).to.equal('    hello');
      expect(indent(2, 'hello')).to.equal('  hello');
      expect(indent(0, 'hello')).to.equal('hello');
    });

    it('should intent a multiline string by (n) spaces', () => {
      expect(indent(2, 'foo\nbar')).to.equal('  foo\n  bar');
    });
  });

  describe('debugNode(node)', () => {
    it('should render a node with no props or children as single single xml tag', () => {
      expect(debugElement(<div />)).to.equal('<div />');
    });

    it('should render props inline inline', () => {
      expect(debugElement(<div id="foo" className="bar" />)).to.equal('<div id="foo" className="bar" />');
    });

    it('should render children on newline and indented', () => {
      expect(debugElement(<div>
          <span />
        </div>)).to.equal(`<div>
  <span />
</div>`);
    });

    it.skip('should render mixed children', () => {
      expect(debugElement(<div>hello{'world'}</div>)).to.equal(`<div>
  hello
  world
</div>`);
    });

    it('should render props on root and children', () => {
      expect(debugElement(<div id="foo">
          <span id="bar" />
        </div>)).to.equal(`<div id="foo">
  <span id="bar" />
</div>`);
    });

    it('should render text on new line and indented', () => {
      expect(debugElement(<span>some text</span>)).to.equal(`<span>
  some text
</span>`);
    });

    it.skip('should render composite components as tags w/ displayName', () => {
      class Foo extends Component {
        render() { return <div />; }
      }
      Foo.displayName = 'Bar';

      expect(debugElement(<div>
          <Foo />
        </div>)).to.equal(`<div>
  <Bar />
</div>`);
    });

    it.skip('should render composite components as tags w/ name', () => {
      class Foo extends Component {
        render() { return <div />; }
      }

      expect(debugElement(<div>
          <Foo />
        </div>)).to.equal(`<div>
  <Foo />
</div>`);
    });

    it('should render stateless components as tags w/ name', () => {
      const Foo = () => <div />;

      expect(debugElement(<div>
          <Foo />
        </div>)).to.equal(`<div>
  <Foo />
</div>`);
    });

    it.skip('should render mapped children properly', () => {
      expect(debugElement(<div>
          <i>not in array</i>
          {['a', 'b', 'c']}
        </div>)).to.equal(`<div>
  <i>
    not in array
  </i>
  a
  b
  c
</div>`);
    });

    it.skip('should render number children properly', () => {
      expect(debugElement(<div>
          {-1}
          {0}
          {1}
        </div>)).to.equal(`<div>
  -1
  0
  1
</div>`);
    });

    it('renders html entities properly', () => {
      expect(debugElement(<div>&gt;</div>)).to.equal(`<div>
  &gt;
</div>`);
    });

    it.skip('should not render falsy children ', () => {
      expect(debugElement(<div id="foo">
          {false}
          {null}
          {undefined}
          {''}
        </div>)).to.equal('<div id="foo" />');
    });
  });

  describe('debugInst(inst)', () => {
    it.skip('renders basic debug of mounted components', () => {
      class Foo extends Component {
        render() {
          return (
            <div className="foo">
              <span>Foo</span>
            </div>
          );
        }
      }
      expect(mount(<Foo id="2" />).debug()).to.eql(`<Foo id="2">
  <div className="foo">
    <span>
      Foo
    </span>
  </div>
</Foo>`);
    });

    it.skip('renders basic debug of components with mixed children', () => {
      class Foo extends Component {
        render() {
          return (
            <div>hello{'world'}</div>
          );
        }
      }
      expect(mount(<Foo id="2" />).debug()).to.eql(`<Foo id="2">
  <div>
    hello
    world
  </div>
</Foo>`);
    });

    it.skip('renders debug of compositional components', () => {
      class Foo extends Component {
        render() {
          return (
            <div className="foo">
              <span>Foo</span>
            </div>
          );
        }
      }
      class Bar extends Component {
        render() {
          return (
            <div className="bar">
              <span>Non-Foo</span>
              <Foo baz="bax" />
            </div>
          );
        }
      }
      expect(mount(<Bar id="2" />).debug()).to.eql(`<Bar id="2">
  <div className="bar">
    <span>
      Non-Foo
    </span>
    <Foo baz="bax">
      <div className="foo">
        <span>
          Foo
        </span>
      </div>
    </Foo>
  </div>
</Bar>`);
    });

    it.skip('renders a subtree of a mounted tree', () => {
      class Foo extends Component {
        render() {
          return (
            <div className="foo">
              <span>Foo</span>
            </div>
          );
        }
      }
      class Bar extends Component {
        render() {
          return (
            <div className="bar">
              <span>Non-Foo</span>
              <Foo baz="bax" />
            </div>
          );
        }
      }
      expect(mount(<Bar id="2" />).find(Foo).debug()).to.eql(`<Foo baz="bax">
  <div className="foo">
    <span>
      Foo
    </span>
  </div>
</Foo>`);
    });

    it.skip('renders passed children properly', () => {
      class Foo extends Component {
        render() {
          return (
            <div className="foo">
              <span>From Foo</span>
              {this.props.children}
            </div>
          );
        }
      }
      class Bar extends Component {
        render() {
          return (
            <div className="bar">
              <Foo baz="bax">
                <span>From Bar</span>
              </Foo>
            </div>
          );
        }
      }

      expect(mount(<Bar id="2" />).debug()).to.eql(`<Bar id="2">
  <div className="bar">
    <Foo baz="bax">
      <div className="foo">
        <span>
          From Foo
        </span>
        <span>
          From Bar
        </span>
      </div>
    </Foo>
  </div>
</Bar>`);
    });

    describe('stateless function components', () => {
      it.skip('renders basic debug of mounted components', () => {
        const Foo = () => (
          <div className="foo">
            <span>Foo</span>
          </div>
        );
        expect(mount(<Foo id="2" />).debug()).to.eql(`<Foo id="2">
  <div className="foo">
    <span>
      Foo
    </span>
  </div>
</Foo>`);
      });

      it('renders debug of compositional components', () => {
        const Foo = () => (
          <div className="foo">
            <span>Foo</span>
          </div>
        );
        const Bar = () => (
          <div className="bar">
            <span>Non-Foo</span>
            <Foo baz="bax" />
          </div>
        );
        expect(mount(<Bar id="2" />).debug()).to.eql(`<Bar id="2">
  <div className="bar">
    <span>
      Non-Foo
    </span>
    <Foo baz="bax">
      <div className="foo">
        <span>
          Foo
        </span>
      </div>
    </Foo>
  </div>
</Bar>`);
      });

      it.skip('renders a subtree of a mounted tree', () => {
        const Foo = () => (
          <div className="foo">
            <span>Foo</span>
          </div>
        );
        const Bar = () => (
          <div className="bar">
            <span>Non-Foo</span>
            <Foo baz="bax" />
          </div>
        );
        expect(mount(<Bar id="2" />).find(Foo).debug()).to.eql(`<Foo baz="bax">
  <div className="foo">
    <span>
      Foo
    </span>
  </div>
</Foo>`);
      });

      it('renders passed children properly', () => {
        const Foo = props => (
          <div className="foo">
            <span>From Foo</span>
            {props.children}
          </div>
        );

        const Bar = () => (
          <div className="bar">
            <Foo baz="bax">
              <span>From Bar</span>
            </Foo>
          </div>
        );

        expect(mount(<Bar id="2" />).debug()).to.eql(`<Bar id="2">
  <div className="bar">
    <Foo baz="bax">
      <div className="foo">
        <span>
          From Foo
        </span>
        <span>
          From Bar
        </span>
      </div>
    </Foo>
  </div>
</Bar>`);
      });
    });
  });

  describe.skip('shallow', () => {
    it('renders shallow wrapper properly', () => {
      class Foo extends Component {
        render() {
          return (
            <div className="foo">
              <span>From Foo</span>
              {this.props.children}
            </div>
          );
        }
      }
      class Bar extends Component {
        render() {
          return (
            <div className="bar">
              <Foo baz="bax">
                <span>From Bar</span>
              </Foo>
            </div>
          );
        }
      }

      expect(shallow(<Bar id="2" />).debug()).to.eql(`<div className="bar">
  <Foo baz="bax">
    <span>
      From Bar
    </span>
  </Foo>
</div>`);
    });
  });

  describe('debugNodes', () => {
    it.skip('can render a single node', () => {
      class Foo extends Component {
        render() {
          return (
            <div className="foo">
              <span>inside Foo</span>
            </div>
          );
        }
      }

      expect(debugNodes(shallow(<Foo />).getNodesInternal())).to.eql(`<div className="foo">
  <span>
    inside Foo
  </span>
</div>`);
    });

    it.skip('can render multiple nodes', () => {
      class Foo extends Component {
        render() {
          return (
            <div className="foo">
              <span>inside Foo</span>
            </div>
          );
        }
      }

      class Bar extends Component {
        render() {
          return (
            <div className="bar">
              <Foo key="foo1" />
              <Foo key="foo2" />
              <Foo key="foo3" />
            </div>
          );
        }
      }

      expect(debugNodes(shallow(<Bar />).children().getElements())).to.eql(`<Foo />


<Foo />


<Foo />`);
    });

    it.skip('can render multiple nodes with indent', () => {
      class Foo extends Component {
        render() {
          return (
            <div className="bar">
              <span>span1 text</span>
              <span>span2 text</span>
              <span>span3 text</span>
            </div>
          );
        }
      }

      expect(debugNodes(shallow(<Foo />).children().getNodesInternal())).to.eql(`<span>
  span1 text
</span>


<span>
  span2 text
</span>


<span>
  span3 text
</span>`);
    });
  });

  describe.skip('debug shallow wrapper', () => {
    it.skip('options.ignoreProps causes props to be omitted', () => {
      class Foo extends Component {
        render() {
          return (
            <div className="foo">
              {this.props.fooVal}
            </div>
          );
        }
      }

      class Bar extends Component {
        render() {
          return (
            <div className="class1">
              <Foo fooVal="baz" />
              <span className="class2">span text</span>
            </div>
          );
        }
      }

      expect(shallow(<Bar />).debug({ ignoreProps: false })).to.eql(`<div className="class1">
  <Foo fooVal="baz" />
  <span className="class2">
    span text
  </span>
</div>`);

      expect(shallow(<Bar />).debug({ ignoreProps: true })).to.eql(`<div>
  <Foo />
  <span>
    span text
  </span>
</div>`);
    });
  });

  describe('debug React wrapper', () => {
    it.skip('options.ignoreProps causes props to be omitted', () => {
      class Foo extends Component {
        render() {
          return (
            <div className="foo">
              {this.props.fooVal}
            </div>
          );
        }
      }

      class Bar extends Component {
        render() {
          return (
            <div className="class1">
              <Foo fooVal="baz" />
              <span className="class2">span text</span>
            </div>
          );
        }
      }

      expect(mount(<Bar />).debug({ ignoreProps: false })).to.eql(`<Bar>
  <div className="class1">
    <Foo fooVal="baz">
      <div className="foo">
        baz
      </div>
    </Foo>
    <span className="class2">
      span text
    </span>
  </div>
</Bar>`);

      expect(mount(<Bar />).debug({ ignoreProps: true })).to.eql(`<Bar>
  <div>
    <Foo>
      <div>
        baz
      </div>
    </Foo>
    <span>
      span text
    </span>
  </div>
</Bar>`);
    });
  });
});
