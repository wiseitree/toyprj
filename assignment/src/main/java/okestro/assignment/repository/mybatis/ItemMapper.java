package okestro.assignment.repository.mybatis;


import okestro.assignment.domain.Item;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ItemMapper {
    void save(Item item);


}
