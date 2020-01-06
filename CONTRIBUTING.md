Any help is welcome! Beginners and veteran coders can contribute, even if just by playing around and
hunting for bugs.

## Instructions

### Bugs

1.  Search the open _and_ closed issues to see if the bug has occurred before. If there is a closed 
    issue, link to it from a new issue. If there is an open issue, add a comment.

2.  Include as much information as you can in your issue description, including the expected
    behavior, actual behavior, version, and anything else that might be useful.

3.  If you want to work on the issue yourself, see [Contributing Code](#contributing-code)

### Feature Requests

    This library is for category-theory based typescript interfaces and common 
    instances of them. If you need something very specific or complex, you can 
    implement it in your own project.

1.  Search the open _and_ closed issues to see if the feature has already been requested. If there 
    is a closed issue, leave a comment explaining why it should be reopened. Please do not open a 
    new issue for it. If there is an open issue, add a comment explaining your need. A +1 is fine 
    too.

2.  Open a new issue if you couldn't find one. Describe the instance or interface you need added. If
    possible, link to a Haskell type, or some other existing documentation for the instance you're
    looking for. Regarding interfaces, for now, only those included in fantasy-land or static-land 
    will be included. If you need something special, you can create your own using the types 
    exported in the [HKT][hkt-module] module.

### Contributing Code

If you're looking to write some interfaces or instances, you're welcome to!

1.  Fork the repository.

2.  Clone your fork, and create a new branch from develop.

3.  At this point, I recommend pushing your branch and starting your pull request. This will signal
    to other contributors that you're working on it. Make sure to _add the `WIP` label_ and target
    the develop branch.

4.  Once you've made your desired changes, commit using `yarn commit`. This will ensure that the
    commit format is followed correctly. Push your changes. Do not skip git hooks or your PR will be
    rejected.

5.  Once your changes are ready, remove the `WIP` label from your pull request. Add 
    @williamareynolds as a reviewer.

#### Requirements

-   100% code coverage
-   All instances are property tested for all implemented categories using fast-check
-   New categories/interfaces are fantasy-land _and_ static-land compliant
-   The style of changes generally matches the existing code

[hkt-module]: src/HKT.ts
