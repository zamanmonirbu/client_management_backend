
import { AppError } from '../../src/utils/appError';
import * as service from '../../src/modules/client/client.service';
import * as repo from '../../src/modules/client/client.repository';
import { ClientCreateDTO, ClientUpdateDTO } from '../../src/modules/client/client.types';

jest.mock('../../src/modules/client/client.repository');
const mockRepo = repo as jest.Mocked<typeof repo>;

type Client = {
  id: string;
  firstName: string;
  lastName: string;
  address: string;
  dob: Date;
  email: string;
  cell: string;
  companyName: string;
  price: string;
  comments: string | null;
  createdAt: Date;
  updatedAt: Date;
};


const mockClient: Client = {
  id: 'client-123',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  address: '123 Main St',
  dob: new Date('1990-01-01'),
  cell: '1234567890',
  companyName: 'Test Company',
  price: '1000',
  comments: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('Client Service Unit Tests (Simplified)', () => {
  beforeEach(() => jest.clearAllMocks());
  describe('createClientService', () => {
    const clientData: ClientCreateDTO = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      address: '123 Main St',
      dob: new Date('1990-01-01'),
      cell: '1234567890',
      companyName: 'Test Company',
      price: '1000',
    };

    it('should create client successfully', async () => {
      mockRepo.findClientByEmail.mockResolvedValue(null);
      mockRepo.createClient.mockResolvedValue(mockClient);

      const result = await service.createClientService(clientData);

      expect(result).toEqual(mockClient);
      expect(mockRepo.createClient).toHaveBeenCalledWith(clientData);
    });

    it('should throw AppError if email exists', async () => {
      mockRepo.findClientByEmail.mockResolvedValue(mockClient);

      await expect(service.createClientService(clientData)).rejects.toThrow(AppError);
    });
  });

  describe('listClientsService', () => {
    it('should return paginated clients', async () => {
      mockRepo.findAllClients.mockResolvedValue({
        clients: [mockClient],
        total: 1,
      });

      const result = await service.listClientsService(1, 10);

      expect(result.data).toEqual([mockClient]);
      expect(result.pagination.total).toBe(1);
    });
  });

  describe('getClientService', () => {
    it('should return client by ID', async () => {
      mockRepo.findClientById.mockResolvedValue(mockClient);

      const result = await service.getClientService('client-123');

      expect(result).toEqual(mockClient);
    });

    it('should throw if client not found', async () => {
      mockRepo.findClientById.mockResolvedValue(null);

      await expect(service.getClientService('invalid')).rejects.toThrow(AppError);
    });
  });

  describe('updateClientService', () => {
    const updateData: ClientUpdateDTO = { firstName: 'Jane' };

    it('should update client successfully', async () => {
      const updated = { ...mockClient, firstName: 'Jane' };
      mockRepo.findClientById.mockResolvedValue(mockClient);
      mockRepo.findClientByEmail.mockResolvedValue(null);
      mockRepo.updateClientById.mockResolvedValue(updated);

      const result = await service.updateClientService('client-123', updateData);

      expect(result).toEqual(updated);
    });

    it('should throw if client not found', async () => {
      mockRepo.findClientById.mockResolvedValue(null);

      await expect(service.updateClientService('invalid', updateData)).rejects.toThrow(AppError);
    });
  });


  describe('deleteClientService', () => {
    it('should delete client successfully', async () => {
      mockRepo.findClientById.mockResolvedValue(mockClient);

      await service.deleteClientService('client-123');

      expect(mockRepo.deleteClientById).toHaveBeenCalledWith('client-123');
    });

    it('should throw if not found', async () => {
      mockRepo.findClientById.mockResolvedValue(null);

      await expect(service.deleteClientService('invalid')).rejects.toThrow(AppError);
    });
  });
});
