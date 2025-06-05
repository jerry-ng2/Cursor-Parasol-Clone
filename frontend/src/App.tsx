import React, { useEffect } from 'react';
import {
  Page,
  PageSidebar,
  Avatar,
  Brand,
  Nav,
  NavList,
  NavItem,
  PageSection,
  PageSectionVariants,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  Button,
  TextInput,
  Select,
  SelectOption,
  MenuToggle,
  Modal,
  Form,
  FormGroup,
  TextArea,
  Alert,
  ActionGroup,
} from '@patternfly/react-core';
import {
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from '@patternfly/react-table';
import { BellIcon, CogIcon, SearchIcon } from '@patternfly/react-icons';
import pfLogo from './logo.svg';

const navItems = [
  'Dashboard',
  'Policies',
  'Claims',
  'Coverages',
  'Annuities',
  'Subscriptions',
  'Reports',
];

const columns = [
  'Claim Number',
  'Category',
  'Client Name',
  'Policy Number',
  'Status',
];

const claims: any[] = [];

const Masthead: React.FC = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: '#212427',
    padding: '0 24px',
    height: 56,
    borderBottom: '1px solid #222',
  }}>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Brand src={pfLogo} alt="Parasol" style={{ height: 32, marginRight: 16 }} />
      <span style={{ color: 'white', fontWeight: 600, fontSize: 20 }}>Parasol™</span>
    </div>
    <Toolbar style={{ background: 'transparent' }}>
      <ToolbarContent>
        <ToolbarItem>
          <Button variant="plain" aria-label="Notifications">
            <BellIcon />
          </Button>
        </ToolbarItem>
        <ToolbarItem>
          <Button variant="plain" aria-label="Settings">
            <CogIcon />
          </Button>
        </ToolbarItem>
      </ToolbarContent>
    </Toolbar>
  </div>
);

const App: React.FC = () => {
  const [activeItem, setActiveItem] = React.useState(2); // Claims
  const [category, setCategory] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState<string | null>(null);
  const [isCategoryOpen, setIsCategoryOpen] = React.useState(false);
  const [isStatusOpen, setIsStatusOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [form, setForm] = React.useState({
    claim_number: '',
    category: '',
    client_name: '',
    policy_number: '',
    status: '',
    description: '',
  });
  const [claims, setClaims] = React.useState<any[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  // Fetch claims from backend
  useEffect(() => {
    fetch('http://localhost:8000/api/db/claims')
      .then(res => res.json())
      .then(setClaims)
      .catch(() => setClaims([]));
  }, []);

  const handleOpenModal = () => {
    setForm({
      claim_number: '',
      category: '',
      client_name: '',
      policy_number: '',
      status: '',
      description: '',
    });
    setError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setError(null);
  };

  const handleFormChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setError(null);
    try {
      const res = await fetch('http://localhost:8000/api/db/claims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || 'Failed to create claim');
      }
      setIsModalOpen(false);
      // Refresh claims list
      fetch('http://localhost:8000/api/db/claims')
        .then(res => res.json())
        .then(setClaims)
        .catch(() => setClaims([]));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const Sidebar = (
    <PageSidebar>
      <Nav>
        <NavList>
          {navItems.map((item, idx) => (
            <NavItem key={item} isActive={activeItem === idx} onClick={() => setActiveItem(idx)}>
              {item}
            </NavItem>
          ))}
        </NavList>
      </Nav>
    </PageSidebar>
  );

  return (
    <Page masthead={<Masthead />} sidebar={Sidebar} isManagedSidebar>
      <PageSection variant="default" style={{ minHeight: '100vh' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <h1 style={{ margin: 0 }}>Claims</h1>
            <Button variant="primary" onClick={handleOpenModal}>Create Claim</Button>
          </div>
          {/* Modal for creating a claim */}
          <Modal
            title="Create New Claim"
            isOpen={isModalOpen}
            onClose={handleCloseModal}
          >
            <Form isWidthLimited>
              <FormGroup label="Claim Number" isRequired fieldId="claim_number">
                <TextInput
                  isRequired
                  id="claim_number"
                  value={form.claim_number}
                  onChange={(_e, v) => handleFormChange('claim_number', v)}
                />
              </FormGroup>
              <FormGroup label="Category" isRequired fieldId="category">
                <TextInput
                  isRequired
                  id="category"
                  value={form.category}
                  onChange={(_e, v) => handleFormChange('category', v)}
                />
              </FormGroup>
              <FormGroup label="Client Name" isRequired fieldId="client_name">
                <TextInput
                  isRequired
                  id="client_name"
                  value={form.client_name}
                  onChange={(_e, v) => handleFormChange('client_name', v)}
                />
              </FormGroup>
              <FormGroup label="Policy Number" isRequired fieldId="policy_number">
                <TextInput
                  isRequired
                  id="policy_number"
                  value={form.policy_number}
                  onChange={(_e, v) => handleFormChange('policy_number', v)}
                />
              </FormGroup>
              <FormGroup label="Status" isRequired fieldId="status">
                <TextInput
                  isRequired
                  id="status"
                  value={form.status}
                  onChange={(_e, v) => handleFormChange('status', v)}
                />
              </FormGroup>
              <FormGroup label="Description" fieldId="description">
                <TextArea
                  id="description"
                  value={form.description}
                  onChange={(_e, v) => handleFormChange('description', v)}
                />
              </FormGroup>
              {error && <Alert variant="danger" title={error} />}
              <ActionGroup>
                <Button variant="primary" onClick={handleSubmit}>Submit</Button>
                <Button variant="link" onClick={handleCloseModal}>Cancel</Button>
              </ActionGroup>
            </Form>
          </Modal>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
            <TextInput
              value={search}
              type="search"
              onChange={(_event, value) => setSearch(value as string)}
              aria-label="Search claims"
              placeholder="Search claims"
              style={{ width: 500, marginRight: 32 }}
            />
            <Button variant="control" aria-label="search" style={{ marginRight: 32 }}>
              <SearchIcon />
            </Button>
            <Select
              variant="default"
              aria-label="Select category"
              isOpen={isCategoryOpen}
              selected={category || 'Any category'}
              onSelect={(_event, value) => {
                setCategory(value as string);
                setIsCategoryOpen(false);
              }}
              toggle={toggleRef => (
                <MenuToggle
                  ref={toggleRef}
                  onClick={() => setIsCategoryOpen(prev => !prev)}
                  isExpanded={isCategoryOpen}
                  aria-label="Select category"
                >
                  {category || 'Any category'}
                </MenuToggle>
              )}
              style={{ width: 180, marginRight: 16 }}
            >
              <SelectOption key="any" value="Any category" />
              <SelectOption key="auto" value="Auto" />
              <SelectOption key="home" value="Home" />
              <SelectOption key="life" value="Life" />
            </Select>
            <Select
              variant="default"
              aria-label="Select status"
              isOpen={isStatusOpen}
              selected={status || 'Any status'}
              onSelect={(_event, value) => {
                setStatus(value as string);
                setIsStatusOpen(false);
              }}
              toggle={toggleRef => (
                <MenuToggle
                  ref={toggleRef}
                  onClick={() => setIsStatusOpen(prev => !prev)}
                  isExpanded={isStatusOpen}
                  aria-label="Select status"
                >
                  {status || 'Any status'}
                </MenuToggle>
              )}
              style={{ width: 180 }}
            >
              <SelectOption key="any" value="Any status" />
              <SelectOption key="open" value="Open" />
              <SelectOption key="closed" value="Closed" />
              <SelectOption key="pending" value="Pending" />
            </Select>
          </div>
          <Table aria-label="Claims table" variant="compact" borders={true} style={{ background: 'white' }}>
            <Thead>
              <Tr>
                {columns.map((col) => (
                  <Th key={col} style={{ border: '1px solid black' }}>{col}</Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {claims.length === 0 ? (
                <Tr>
                  <Td colSpan={columns.length} style={{ textAlign: 'center' }}>
                    No claims found
                  </Td>
                </Tr>
              ) : (
                claims.map((claim, idx) => (
                  <Tr key={idx}>
                    <Td style={{ border: '1px solid black', textAlign: 'center' }}>{claim.claim_number}</Td>
                    <Td style={{ border: '1px solid black', textAlign: 'center' }}>{claim.category}</Td>
                    <Td style={{ border: '1px solid black', textAlign: 'center' }}>{claim.client_name}</Td>
                    <Td style={{ border: '1px solid black', textAlign: 'center' }}>{claim.policy_number}</Td>
                    <Td style={{ border: '1px solid black', textAlign: 'center' }}>{claim.status}</Td>
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
        </div>
      </PageSection>
    </Page>
  );
};

export default App;
